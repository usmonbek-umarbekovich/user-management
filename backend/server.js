const express = require('express');
const connectDB = require('./db');
require('dotenv').config();

const port = process.env.PORT || 5000;

connectDB();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api/users', require('./userRoutes'));

app.use(require('./middlewares/errorHandler'));

app.listen(port, () => console.log(`Server started on port ${port}`));
