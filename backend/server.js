const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const path = require('path');
const connectDB = require('./db');
require('dotenv').config();

const port = process.env.PORT || 5000;

const clientPromise = connectDB().then(m => m.connection.getClient());

const app = express();

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
      autoRemove: 'disabled',
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

app.listen(port, () => console.log(`Server started on port ${port}`));
