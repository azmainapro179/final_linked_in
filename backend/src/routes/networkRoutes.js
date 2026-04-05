import { buildCompanyFollowSuggestions } from '../services/companyFollowSuggestions.js'
import { buildNetworkSuggestions } from '../services/networkSuggestions.js'
import { parseProfile } from '../utils/profile.js'

const parseCompanyList = (rows = []) =>
  rows.map((company) => ({
    ...company,
    specialties: company.specialties
      ? (typeof company.specialties === 'string' ? JSON.parse(company.specialties) : company.specialties)
      : [],
  }))

export async function handleNetworkRoutes(req, res, context) {
  const { pool, send } = context

  if (req.url === '/api/follow-company' && req.method === 'POST') {
    try {
      const { userId, companyId } = await context.parseBody(req)
      if (!userId || !companyId) {
        send(res, 400, { message: 'User ID and company ID are required.' })
        return true
      }

      const [companyRows] = await pool.query('SELECT id FROM companies WHERE id = ? LIMIT 1', [companyId])
      if (!companyRows.length) {
        send(res, 404, { message: 'Company not found.' })
        return true
      }

      const [result] = await pool.query(
        'INSERT IGNORE INTO company_follows (userId, companyId, createdAt) VALUES (?, ?, ?)',
        [userId, companyId, new Date()],
      )
      if (result?.affectedRows > 0) {
        await pool.query('UPDATE companies SET followers = followers + 1 WHERE id = ?', [companyId])
      }

      send(res, 200, { message: 'Company followed successfully.' })
      return true
    } catch (error) {
      console.error('Follow company error', error)
      send(res, 400, { message: 'Invalid follow company payload.' })
      return true
    }
  }

  if (req.url === '/api/unfollow-company' && req.method === 'POST') {
    try {
      const { userId, companyId } = await context.parseBody(req)
      if (!userId || !companyId) {
        send(res, 400, { message: 'User ID and company ID are required.' })
        return true
      }

      const [result] = await pool.query(
        'DELETE FROM company_follows WHERE userId = ? AND companyId = ?',
        [userId, companyId],
      )
      if (result?.affectedRows > 0) {
        await pool.query(
          'UPDATE companies SET followers = GREATEST(followers - 1, 0) WHERE id = ?',
          [companyId],
        )
      }

      send(res, 200, { message: 'Company unfollowed successfully.' })
      return true
    } catch (error) {
      console.error('Unfollow company error', error)
      send(res, 400, { message: 'Invalid unfollow company payload.' })
      return true
    }
  }

  if (req.url?.startsWith('/api/followed-companies') && req.method === 'GET') {
    const url = new URL(req.url, 'http://localhost')
    const userId = url.searchParams.get('userId')?.trim()
    if (!userId) {
      send(res, 400, { message: 'User ID is required.' })
      return true
    }

    try {
      const [rows] = await pool.query(
        `SELECT c.*
         FROM company_follows cf
         JOIN companies c ON c.id = cf.companyId
         WHERE cf.userId = ?
         ORDER BY cf.createdAt DESC`,
        [userId],
      )

      const companies = parseCompanyList(rows)
      send(res, 200, { companies, count: companies.length })
      return true
    } catch (error) {
      console.error('Followed companies error', error)
      send(res, 500, { message: 'Failed to load followed companies.' })
      return true
    }
  }

  if (req.url?.startsWith('/api/network-suggestions') && req.method === 'GET') {
    const url = new URL(req.url, 'http://localhost')
    const userId = url.searchParams.get('userId')?.trim()
    if (!userId) {
      send(res, 400, { message: 'User ID is required.' })
      return true
    }

    try {
      const [userRows] = await pool.query(
        'SELECT id, fullName, headline, profile FROM users WHERE id = ? LIMIT 1',
        [userId],
      )
      if (!userRows.length) {
        send(res, 404, { message: 'User not found.' })
        return true
      }

      const [currentConnectionRows] = await pool.query(
        'SELECT pending, connected, invited FROM connections WHERE id = ? LIMIT 1',
        [userId],
      )
      const [followRows] = await pool.query(
        `SELECT c.id, c.name
         FROM company_follows cf
         JOIN companies c ON c.id = cf.companyId
         WHERE cf.userId = ?`,
        [userId],
      )
      const [allUsersRows] = await pool.query(
        'SELECT id, email, fullName, headline, profile FROM users LIMIT 200',
      )
      const [allConnectionRows] = await pool.query(
        'SELECT id, pending, connected, invited FROM connections LIMIT 200',
      )

      const suggestions = buildNetworkSuggestions({
        userId,
        currentProfile: parseProfile(userRows[0].profile),
        currentConnections: currentConnectionRows[0] || {},
        followRows,
        allUsersRows,
        allConnectionRows,
      })

      send(res, 200, { suggestions, count: suggestions.length })
      return true
    } catch (error) {
      console.error('Network suggestions error', error)
      send(res, 500, { message: 'Failed to load network suggestions.' })
      return true
    }
  }

  if (req.url?.startsWith('/api/company-follow-suggestions') && req.method === 'GET') {
    const url = new URL(req.url, 'http://localhost')
    const userId = url.searchParams.get('userId')?.trim()
    if (!userId) {
      send(res, 400, { message: 'User ID is required.' })
      return true
    }

    try {
      const [[userRows], [connectionRows], [followRows], [allCompaniesRows], [allUsersRows]] = await Promise.all([
        pool.query('SELECT id, profile FROM users WHERE id = ? LIMIT 1', [userId]),
        pool.query('SELECT pending, connected, invited FROM connections WHERE id = ? LIMIT 1', [userId]),
        pool.query(
          `SELECT c.*
           FROM company_follows cf
           JOIN companies c ON c.id = cf.companyId
           WHERE cf.userId = ?`,
          [userId],
        ),
        pool.query('SELECT * FROM companies LIMIT 300'),
        pool.query('SELECT id, fullName, profile FROM users LIMIT 300'),
      ])

      if (!userRows.length) {
        send(res, 404, { message: 'User not found.' })
        return true
      }

      const suggestions = buildCompanyFollowSuggestions({
        currentProfile: parseProfile(userRows[0].profile),
        currentConnections: connectionRows[0] || {},
        followedCompanies: followRows,
        allCompaniesRows,
        allUsersRows,
      })

      send(res, 200, { companies: suggestions, count: suggestions.length })
      return true
    } catch (error) {
      console.error('Company follow suggestions error', error)
      send(res, 500, { message: 'Failed to load company follow suggestions.' })
      return true
    }
  }

  return false
}
