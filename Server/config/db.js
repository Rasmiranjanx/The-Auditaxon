const mongoose = require('mongoose')

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 3000,
    })
    console.log(`MongoDB connected: ${conn.connection.host}`)
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`)
    if (process.env.NODE_ENV === 'production') {
      process.exit(1)
    } else {
      console.warn(
        '[WARN] Continuing server startup in development. Connect a valid MongoDB URI in Server/.env to enable database operations.'
      )
    }
  }
}

module.exports = connectDB
