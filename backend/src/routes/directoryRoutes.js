import { parseProfile } from '../utils/profile.js'

const parseCompanies = (rows = []) =>
  rows.map((company) => ({
    ...company,
    specialties: company.specialties
      ? (typeof company.specialties === 'string' ? JSON.parse(company.specialties) : company.specialties)
      : [],
  }))

const parseSchools = (rows = []) =>
  rows.map((school) => ({
    ...school,
    programs: school.programs
      ? (typeof school.programs === 'string' ? JSON.parse(school.programs) : school.programs)
      : [],
  }))

export async function handleDirectoryRoutes(req, res, context) {
  const { pool, send } = context

  if (req.url?.startsWith('/api/search') && req.method === 'GET') {
    const url = new URL(req.url, 'http://localhost')
    const query = url.searchParams.get('q')?.trim().toLowerCase() || ''
    if (!query || query.length < 2) {
      send(res, 200, { users: [], message: 'Enter at least 2 characters to search.' })
      return true
    }

    try {
      const [rows] = await pool.query('SELECT id, email, fullName, headline, profile FROM users LIMIT 100')
      const users = rows
        .map((user) => ({
          id: user.id,
          email: user.email,
          fullName: user.fullName,
          headline: user.headline,
          profile: parseProfile(user.profile),
        }))
        .filter((user) => {
          const q = query.toLowerCase()
          if (user.fullName?.toLowerCase().includes(q)) return true
          if (user.headline?.toLowerCase().includes(q)) return true
          if (user.email?.toLowerCase().includes(q)) return true
          if (user.profile?.workHistory?.some((item) => item.company?.toLowerCase().includes(q) || item.title?.toLowerCase().includes(q))) return true
          if (user.profile?.education?.some((item) => item.school?.toLowerCase().includes(q) || item.field?.toLowerCase().includes(q))) return true
          if (user.profile?.skills?.some((item) => item?.toLowerCase().includes(q))) return true
          if (user.profile?.interests?.some((item) => item?.toLowerCase().includes(q))) return true
          return false
        })
        .slice(0, 20)

      send(res, 200, { users, count: users.length })
      return true
    } catch (error) {
      console.error('Search error', error)
      send(res, 500, { message: 'Search failed.' })
      return true
    }
  }

  if (req.url?.startsWith('/api/user/') && req.method === 'GET') {
    const userId = req.url.split('/api/user/')[1]?.split('?')[0]
    if (!userId) {
      send(res, 400, { message: 'User ID is required.' })
      return true
    }

    try {
      const [rows] = await pool.query(
        'SELECT id, email, fullName, headline, profile, createdAt FROM users WHERE id = ? LIMIT 1',
        [userId],
      )
      if (!rows.length) {
        send(res, 404, { message: 'User not found.' })
        return true
      }

      const user = rows[0]
      send(res, 200, {
        user: {
          id: user.id,
          email: user.email,
          fullName: user.fullName,
          headline: user.headline,
          profile: parseProfile(user.profile),
          createdAt: user.createdAt,
        },
      })
      return true
    } catch (error) {
      console.error('Get user error', error)
      send(res, 500, { message: 'Failed to get user.' })
      return true
    }
  }

  if (req.url?.startsWith('/api/companies') && req.method === 'GET') {
    const url = new URL(req.url, 'http://localhost')
    const query = url.searchParams.get('q')?.trim().toLowerCase() || ''
    if (!query || query.length < 2) {
      send(res, 200, { companies: [], message: 'Enter at least 2 characters to search.' })
      return true
    }

    try {
      const searchPattern = `%${query}%`
      const [rows] = await pool.query(
        `SELECT id, name, industry, location, description, website, logo, followers, employeeCount, founded, specialties
         FROM companies
         WHERE LOWER(name) LIKE ?
            OR LOWER(industry) LIKE ?
            OR LOWER(location) LIKE ?
         LIMIT 20`,
        [searchPattern, searchPattern, searchPattern],
      )

      const companies = parseCompanies(rows)
      send(res, 200, { companies, count: companies.length })
      return true
    } catch (error) {
      console.error('Companies search error', error)
      send(res, 500, { message: 'Companies search failed.' })
      return true
    }
  }

  if (req.url?.startsWith('/api/company/') && req.method === 'GET') {
    const companyId = req.url.split('/api/company/')[1]?.split('?')[0]
    if (!companyId) {
      send(res, 400, { message: 'Company ID is required.' })
      return true
    }

    try {
      const [rows] = await pool.query('SELECT * FROM companies WHERE id = ? LIMIT 1', [companyId])
      if (!rows.length) {
        send(res, 404, { message: 'Company not found.' })
        return true
      }

      const [company] = parseCompanies(rows)
      send(res, 200, { company })
      return true
    } catch (error) {
      console.error('Get company error', error)
      send(res, 500, { message: 'Failed to get company.' })
      return true
    }
  }

  if (req.url?.startsWith('/api/schools') && req.method === 'GET') {
    const url = new URL(req.url, 'http://localhost')
    const query = url.searchParams.get('q')?.trim().toLowerCase() || ''
    if (!query || query.length < 2) {
      send(res, 200, { schools: [], message: 'Enter at least 2 characters to search.' })
      return true
    }

    try {
      const searchPattern = `%${query}%`
      const [rows] = await pool.query(
        `SELECT id, name, type, location, description, website, logo, followers, founded, programs
         FROM schools
         WHERE LOWER(name) LIKE ?
            OR LOWER(type) LIKE ?
            OR LOWER(location) LIKE ?
         LIMIT 20`,
        [searchPattern, searchPattern, searchPattern],
      )

      const schools = parseSchools(rows)
      send(res, 200, { schools, count: schools.length })
      return true
    } catch (error) {
      console.error('Schools search error', error)
      send(res, 500, { message: 'Schools search failed.' })
      return true
    }
  }

  if (req.url?.startsWith('/api/school/') && req.method === 'GET') {
    const schoolId = req.url.split('/api/school/')[1]?.split('?')[0]
    if (!schoolId) {
      send(res, 400, { message: 'School ID is required.' })
      return true
    }

    try {
      const [rows] = await pool.query('SELECT * FROM schools WHERE id = ? LIMIT 1', [schoolId])
      if (!rows.length) {
        send(res, 404, { message: 'School not found.' })
        return true
      }

      const [school] = parseSchools(rows)
      send(res, 200, { school })
      return true
    } catch (error) {
      console.error('Get school error', error)
      send(res, 500, { message: 'Failed to get school.' })
      return true
    }
  }

  if (req.url?.startsWith('/api/jobs') && req.method === 'GET') {
    const url = new URL(req.url, 'http://localhost')
    const query = url.searchParams.get('q')?.trim().toLowerCase() || ''
    if (!query || query.length < 2) {
      send(res, 200, { jobs: [], message: 'Enter at least 2 characters to search.' })
      return true
    }

    try {
      const [rows] = await pool.query('SELECT id, fullName, headline, profile FROM users LIMIT 100')
      const jobs = []

      rows.forEach((user) => {
        const profile = parseProfile(user.profile)
        if (Array.isArray(profile.workHistory)) {
          profile.workHistory.forEach((work) => {
            const matchesCompany = work.company?.toLowerCase().includes(query)
            const matchesTitle = work.title?.toLowerCase().includes(query)
            if (matchesCompany || matchesTitle) {
              jobs.push({
                id: `${user.id}-${work.company}-${work.title}`.replace(/\s+/g, '-'),
                title: work.title,
                company: work.company,
                start: work.start,
                end: work.end,
                current: work.current,
                userId: user.id,
                userName: user.fullName,
                userHeadline: user.headline,
              })
            }
          })
        }
      })

      const uniqueJobs = jobs.reduce((accumulator, job) => {
        const key = `${job.company}-${job.title}`.toLowerCase()
        if (!accumulator.find((item) => `${item.company}-${item.title}`.toLowerCase() === key)) {
          accumulator.push(job)
        }
        return accumulator
      }, [])

      send(res, 200, { jobs: uniqueJobs, count: uniqueJobs.length })
      return true
    } catch (error) {
      console.error('Jobs search error', error)
      send(res, 500, { message: 'Jobs search failed.' })
      return true
    }
  }

  return false
}
