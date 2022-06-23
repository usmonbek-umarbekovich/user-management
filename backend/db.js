const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongo = await mongoose.connect(process.env.MONGO_URI);
    console.log(`Database Connected: ${mongo.connection.host}`);
    return mongo;
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

module.exports = connectDB;
