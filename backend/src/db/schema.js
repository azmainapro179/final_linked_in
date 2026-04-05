export const ensureSchema = async (pool) => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id CHAR(36) NOT NULL,
      email VARCHAR(255) NOT NULL,
      fullName VARCHAR(255) NOT NULL,
      headline VARCHAR(255) NOT NULL DEFAULT '',
      passwordHash CHAR(64) NOT NULL,
      profile JSON NULL,
      createdAt DATETIME NOT NULL,
      updatedAt DATETIME NULL,
      PRIMARY KEY (email)
    )
  `)

  await pool.query(`
    CREATE TABLE IF NOT EXISTS companies (
      id CHAR(36) NOT NULL,
      name VARCHAR(255) NOT NULL,
      industry VARCHAR(255) NOT NULL DEFAULT '',
      location VARCHAR(255) NOT NULL DEFAULT '',
      description TEXT,
      website VARCHAR(255),
      logo VARCHAR(255),
      followers INT DEFAULT 0,
      employeeCount VARCHAR(50),
      founded VARCHAR(10),
      specialties JSON,
      createdAt DATETIME NOT NULL,
      PRIMARY KEY (id)
    )
  `)

  await pool.query(`
    CREATE TABLE IF NOT EXISTS schools (
      id CHAR(36) NOT NULL,
      name VARCHAR(255) NOT NULL,
      type VARCHAR(100) NOT NULL DEFAULT 'University',
      location VARCHAR(255) NOT NULL DEFAULT '',
      description TEXT,
      website VARCHAR(255),
      logo VARCHAR(255),
      followers INT DEFAULT 0,
      founded VARCHAR(10),
      programs JSON,
      createdAt DATETIME NOT NULL,
      PRIMARY KEY (id)
    )
  `)

  await pool.query(`
    CREATE TABLE IF NOT EXISTS connections (
      id CHAR(36) NOT NULL,
      pending JSON,
      connected JSON,
      invited JSON,
      PRIMARY KEY (id)
    )
  `)

  await pool.query(`
    CREATE TABLE IF NOT EXISTS company_follows (
      userId CHAR(36) NOT NULL,
      companyId CHAR(36) NOT NULL,
      createdAt DATETIME NOT NULL,
      PRIMARY KEY (userId, companyId)
    )
  `)

  await pool.query(`
    CREATE TABLE IF NOT EXISTS notifications (
      notificationId CHAR(36) NOT NULL,
      id CHAR(36) NOT NULL,
      notification TEXT NOT NULL,
      createdAt DATETIME NOT NULL,
      \`read\` BOOLEAN NOT NULL DEFAULT FALSE,
      PRIMARY KEY (notificationId)
    )
  `)
}
