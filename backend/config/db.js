const mongoose = require('mongoose')

const connectDB = async () => {
  try {
    const conn = await mongoose.connect("mongodb+srv://proshop:proshop123@cluster0.f0c1x.mongodb.net/EcommerceNext")

    console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline)
  } catch (error) {
    console.log(error)
    process.exit(1)
  }
}

module.exports = connectDB
