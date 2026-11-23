const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '.env') })
require('./config/env')
const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')

const connectDB = require('./config/db')
const { disconnectDB, isDBConnected } = require('./config/db')
const sanitizeRequest = require('./middleware/sanitize')
const { notFound, errorHandler } = require('./middleware/errorHandler')

const authRoutes = require('./routes/authRoutes')
const contentRoutes = require('./routes/contentRoutes')
const teamRoutes = require('./routes/teamRoutes')
const careerRoutes = require('./routes/careerRoutes')
const contactRoutes = require('./routes/contactRoutes')
const reviewRoutes = require('./routes/reviewRoutes')

const isProduction = process.env.NODE_ENV === 'production'

// ---- CORS allowlist: the live site (apex + www), optional extras, and local dev ----
const allowedOrigins = new Set()
const addOrigin = (value) => {
  const origin = (value || '').trim().replace(/\/+$/, '')
  if (origin) allowedOrigins.add(origin)
}
addOrigin(process.env.CLIENT_URL)
try {
  const url = new URL(process.env.CLIENT_URL)
  const altHost = url.hostname.startsWith('www.') ? url.hostname.slice(4) : `www.${url.hostname}`
  addOrigin(`${url.protocol}//${altHost}${url.port ? `:${url.port}` : ''}`)
} catch {
  // CLIENT_URL is validated in config/env.js
}
;(process.env.CORS_ORIGINS || '').split(',').forEach(addOrigin)
if (!isProduction) {
  addOrigin('http://localhost:5173')
  addOrigin('http://127.0.0.1:5173')
}

const app = express()

// Behind Render / Nginx / Hostinger: trust the proxy so req.ip is the visitor's IP
// (needed for per-visitor rate limiting). Override with TRUST_PROXY if your host differs.
app.set('trust proxy', Number.parseInt(process.env.TRUST_PROXY ?? '1', 10) || 1)

app.use(helmet())
app.use(
  cors({
    origin: (origin, callback) => {
      // No Origin header = server-to-server calls, health checks, curl: allow.
      if (!origin || allowedOrigins.has(origin)) return callback(null, true)
      return callback(new Error('Not allowed by CORS'))
    },
  })
)
app.use(express.json({ limit: '1mb' }))
app.use(sanitizeRequest)
app.use(morgan(isProduction ? 'combined' : 'dev'))

app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'The Auditaxon API is running',
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
  })
})

// Health check for the host: 503 when the database connection is down.
app.get('/api/health', (req, res) => {
  const database = isDBConnected() ? 'connected' : 'disconnected'
  res.status(database === 'connected' ? 200 : 503).json({ status: 'ok', database })
})

app.use('/api/reviews', reviewRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/content', contentRoutes)
app.use('/api/team', teamRoutes)
app.use('/api/careers', careerRoutes)
app.use('/api/contact', contactRoutes)

app.use(notFound)
app.use(errorHandler)

const PORT = Number(process.env.PORT) || 5000

const start = async () => {
  await connectDB()

  const server = app.listen(PORT, () => {
    console.log(`The Auditaxon server running on port ${PORT} (${process.env.NODE_ENV})`)
  })

  server.on('error', (err) => {
    console.error(
      err.code === 'EADDRINUSE'
        ? `[FATAL] Port ${PORT} is already in use. Stop the other process or change PORT.`
        : `[FATAL] Server failed to start: ${err.message}`
    )
    process.exit(1)
  })

  // Hosts send SIGTERM before restarting/redeploying: finish requests, close the DB, exit.
  const shutdown = (signal) => {
    console.log(`${signal} received, shutting down...`)
    server.close(async () => {
      await disconnectDB().catch(() => {})
      process.exit(0)
    })
    setTimeout(() => process.exit(1), 10000).unref()
  }
  process.on('SIGTERM', () => shutdown('SIGTERM'))
  process.on('SIGINT', () => shutdown('SIGINT'))
}

process.on('unhandledRejection', (reason) => console.error('[UNHANDLED REJECTION]', reason))

start()
