const mongoose = require('mongoose')

// Only fields defined in the schemas may be used in query filters.
mongoose.set('strictQuery', true)

let listenersAttached = false

const attachListeners = () => {
  if (listenersAttached) return
  listenersAttached = true
  mongoose.connection.on('disconnected', () => console.warn('[DB] MongoDB disconnected'))
  mongoose.connection.on('reconnected', () => console.log('[DB] MongoDB reconnected'))
  mongoose.connection.on('error', (err) => console.error('[DB] MongoDB error:', err.message))
}

/**
 * Connects to MongoDB. In production a failed connection stops the process, so the host
 * (Render, PM2, ...) restarts it instead of serving requests without a database.
 */
const connectDB = async () => {
  attachListeners()
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      // Atlas clusters can take a few seconds to answer the first time.
      serverSelectionTimeoutMS: 10000,
      maxPoolSize: 10,
    })
    console.log(`[DB] MongoDB connected: ${conn.connection.host}/${conn.connection.name}`)

    if (conn.connection.name === 'test') {
      console.warn(
        '[DB] WARNING: using the default "test" database. Add a database name to MONGO_URI, ' +
          'e.g. mongodb+srv://user:pass@cluster.mongodb.net/auditaxon?retryWrites=true&w=majority'
      )
    }
  } catch (error) {
    console.error(`[DB] MongoDB connection error: ${error.message}`)
    if (process.env.NODE_ENV === 'production') {
      process.exit(1)
    } else {
      console.warn(
        '[WARN] Continuing server startup in development. Connect a valid MongoDB URI in Server/.env to enable database operations.'
      )
    }
  }
}

const disconnectDB = () => mongoose.connection.close()

// 1 = connected (used by the /api/health endpoint)
const isDBConnected = () => mongoose.connection.readyState === 1

module.exports = connectDB
module.exports.disconnectDB = disconnectDB
module.exports.isDBConnected = isDBConnected
