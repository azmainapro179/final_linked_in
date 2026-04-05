import crypto from 'node:crypto'
import { parseJsonArray, parseProfile } from '../utils/profile.js'

export async function handleAuthRoutes(req, res, context) {
  const { hashPassword, parseBody, pool, send } = context

  if (req.url === '/api/health') {
    send(res, 200, { status: 'ok', service: 'linkedin-auth' })
    return true
  }

  if (req.url === '/api/signup' && req.method === 'POST') {
    try {
      const { fullName, email, password, headline = '' } = await parseBody(req)
      if (!fullName || !email || !password) {
        send(res, 400, { message: 'Name, email, and password are required.' })
        return true
      }

      const normalizedEmail = email.trim().toLowerCase()
      const [rows] = await pool.query('SELECT email FROM users WHERE email = ? LIMIT 1', [normalizedEmail])
      if (rows.length) {
        send(res, 409, { message: 'Account already exists. Try signing in.' })
        return true
      }

      const now = new Date()
      const profile = {
        workHistory: [],
        education: [],
        skills: [],
        interests: [],
      }
      const userId = crypto.randomUUID()
      await pool.query(
        `INSERT INTO users (id, email, fullName, headline, passwordHash, profile, createdAt, updatedAt)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          userId,
          normalizedEmail,
          fullName.trim(),
          headline.trim(),
          hashPassword(password),
          JSON.stringify(profile),
          now,
          now,
        ],
      )

      await pool.query(
        'INSERT INTO connections (id, pending, connected, invited) VALUES (?, ?, ?, ?)',
        [userId, JSON.stringify([]), JSON.stringify([]), JSON.stringify([])],
      )

      send(res, 201, {
        message: 'Account created. Welcome to LINKEDIN.',
        profile: {
          fullName: fullName.trim(),
          email: normalizedEmail,
          headline: headline.trim(),
        },
      })
      return true
    } catch (error) {
      console.error('Signup error', error)
      send(res, 400, { message: 'Invalid signup payload.' })
      return true
    }
  }

  if (req.url === '/api/signin' && req.method === 'POST') {
    try {
      const { email, password } = await parseBody(req)
      if (!email || !password) {
        send(res, 400, { message: 'Email and password are required.' })
        return true
      }

      const normalizedEmail = email.trim().toLowerCase()
      const [rows] = await pool.query(
        'SELECT id, email, fullName, headline, passwordHash, profile FROM users WHERE email = ? LIMIT 1',
        [normalizedEmail],
      )
      if (!rows.length) {
        send(res, 401, { message: 'Invalid credentials. Please try again.' })
        return true
      }

      const user = rows[0]
      if (!user || user.passwordHash !== hashPassword(password)) {
        send(res, 401, { message: 'Invalid credentials. Please try again.' })
        return true
      }

      const [connections] = await pool.query(
        'SELECT pending, connected, invited FROM connections WHERE id = ? LIMIT 1',
        [user.id],
      )
      const [followRows] = await pool.query(
        'SELECT companyId FROM company_follows WHERE userId = ?',
        [user.id],
      )

      const connection = connections[0] || { pending: '[]', connected: '[]', invited: '[]' }
      let pending = []
      let connected = []
      let invited = []

      try {
        if (connection.pending) pending = parseJsonArray(connection.pending)
      } catch {
        pending = []
      }
      try {
        if (connection.connected) connected = parseJsonArray(connection.connected)
      } catch {
        connected = []
      }
      try {
        if (connection.invited) invited = parseJsonArray(connection.invited)
      } catch {
        invited = []
      }

      const followedCompanyIds = followRows.map((row) => row.companyId)
      const sessionToken = crypto
        .createHash('sha256')
        .update(`${user.email}-${Date.now()}`)
        .digest('hex')
        .slice(0, 48)

      send(res, 200, {
        message: 'Signed in. Redirecting you to LINKEDIN.',
        token: sessionToken,
        profile: {
          id: user.id,
          fullName: user.fullName,
          email: user.email,
          headline: user.headline,
        },
        profileData: parseProfile(user.profile),
        pending,
        connected,
        invited,
        followedCompanyIds,
      })
      return true
    } catch (error) {
      console.error('Signin error', error)
      send(res, 400, { message: 'Invalid signin payload.' })
      return true
    }
  }

  if (req.url === '/api/update-profile' && req.method === 'POST') {
    try {
      const { email, workHistory = [], education = [], skills = [], interests = [] } = await parseBody(req)
      if (!email) {
        send(res, 400, { message: 'Email is required for profile updates.' })
        return true
      }

      const normalizedEmail = email.trim().toLowerCase()
      const profile = {
        workHistory,
        education,
        skills,
        interests,
        updatedAt: new Date().toISOString(),
      }

      const [rows] = await pool.query('SELECT email FROM users WHERE email = ? LIMIT 1', [normalizedEmail])
      if (!rows.length) {
        send(res, 404, { message: 'User not found. Sign in again.' })
        return true
      }

      await pool.query('UPDATE users SET profile = ?, updatedAt = ? WHERE email = ?', [
        JSON.stringify(profile),
        new Date(),
        normalizedEmail,
      ])

      send(res, 200, { message: 'Profile updated successfully.' })
      return true
    } catch (error) {
      console.error('Update profile error', error)
      send(res, 400, { message: 'Invalid profile payload.' })
      return true
    }
  }

  if (req.url?.startsWith('/api/profile') && req.method === 'GET') {
    const url = new URL(req.url, 'http://localhost')
    const email = url.searchParams.get('email')
    if (!email) {
      send(res, 400, { message: 'Email is required.' })
      return true
    }

    try {
      const normalizedEmail = email.trim().toLowerCase()
      const [rows] = await pool.query('SELECT profile FROM users WHERE email = ? LIMIT 1', [normalizedEmail])
      if (!rows.length) {
        send(res, 404, { message: 'Profile not found.' })
        return true
      }
      send(res, 200, { profileData: parseProfile(rows[0].profile) })
      return true
    } catch (error) {
      console.error('Profile read error', error)
      send(res, 500, { message: 'Failed to read profile.' })
      return true
    }
  }

  return false
}
