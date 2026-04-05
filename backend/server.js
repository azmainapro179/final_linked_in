import dotenv from 'dotenv'
import http from 'node:http'
import crypto from 'node:crypto'
import mysql from 'mysql2/promise'
import { ensureSchema } from './src/db/schema.js'
import { handleAuthRoutes } from './src/routes/authRoutes.js'
import { handleConnectionRoutes } from './src/routes/connectionRoutes.js'
import { handleNotificationRoutes } from './src/routes/notificationRoutes.js'
import { parseBody, send } from './src/utils/http.js'

dotenv.config({ path: '.env.local' })

const PORT = process.env.PORT || 4000
const DATABASE_URL = process.env.SINGLESTORE_URL

if (!DATABASE_URL) {
  throw new Error('Missing SINGLESTORE_URL in environment.')
}

const pool = mysql.createPool(DATABASE_URL)

const hashPassword = (value) =>
  crypto.createHash('sha256').update(value).digest('hex')

const routeHandlers = [
  handleAuthRoutes,
  handleConnectionRoutes,
  handleNotificationRoutes,
]

const serverContext = {
  hashPassword,
  parseBody,
  pool,
  send,
}

const server = http.createServer(async (req, res) => {
  if (req.method === 'OPTIONS') {
    return send(res, 200, {})
  }

  for (const handler of routeHandlers) {
    const handled = await handler(req, res, serverContext)
    if (handled) {
      return
    }
  }

  return send(res, 404, { message: 'Route not found.' })
})

ensureSchema(pool)
  .then(() => {
    server.listen(PORT, () => {
      console.log(`LINKEDIN auth backend listening on http://localhost:${PORT}`)
    })
  })
  .catch((error) => {
    console.error('Failed to initialize database', error)
    process.exit(1)
  })
