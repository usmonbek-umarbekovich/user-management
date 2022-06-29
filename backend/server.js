const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const { WebSocketServer } = require('ws');
const WebSocket = require('ws');
const path = require('path');
const http = require('http');
const connectDB = require('./db');
require('dotenv').config();

const port = 5000;

// Connecting to the database
const clientPromise = connectDB().then(mongo => {
  const db = mongo.connection;

  const collection = db.collection('users');
  const changeStream = collection.watch();
  changeStream.on('change', next => {
    wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(next));
      }
    });
  });

  return db.getClient();
});

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.SESSION_SECRET,
    name: 'task-4',
    store: MongoStore.create({
      clientPromise,
      stringify: false,
      ttl: 30 * 24 * 60 * 60, // 30 days
      touchAfter: 24 * 3600, // 24 hours
    }),
  })
);

app.use('/api/users', require('./userRoutes'));

// use static files [production]
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/build')));

  app.get('*', (req, res) =>
    res.sendFile(
      path.resolve(__dirname, '../', 'frontend', 'build', 'index.html')
    )
  );
}

app.use(require('./middlewares/errorHandler'));

server.listen(port, () => console.log(`Server started on port ${port}`));
