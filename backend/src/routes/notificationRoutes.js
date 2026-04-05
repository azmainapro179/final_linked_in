import crypto from 'node:crypto'

export async function handleNotificationRoutes(req, res, context) {
  const { parseBody, pool, send } = context

  if (req.url?.startsWith('/api/notifications') && req.method === 'GET') {
    try {
      const url = new URL(req.url, `http://${req.headers.host}`)
      const userId = url.searchParams.get('userId')
      const limit = parseInt(url.searchParams.get('limit') || '10', 10)
      const offset = parseInt(url.searchParams.get('offset') || '0', 10)
      if (!userId) {
        send(res, 400, { message: 'userId is required' })
        return true
      }

      const [rows] = await pool.query(
        'SELECT notificationId as id, notification, createdAt, `read` FROM notifications WHERE id = ? ORDER BY createdAt DESC LIMIT ? OFFSET ?',
        [userId, limit, offset],
      )
      send(res, 200, { notifications: rows, hasMore: rows.length === limit })
      return true
    } catch (error) {
      console.error('Fetch notifications error', error)
      send(res, 400, { message: 'Unable to fetch notifications.' })
      return true
    }
  }

  if (req.url === '/api/notifications/mark-read' && req.method === 'POST') {
    try {
      const { userId, notificationIds } = await parseBody(req)
      if (!userId || !Array.isArray(notificationIds)) {
        send(res, 400, { message: 'userId and notificationIds array are required.' })
        return true
      }
      if (notificationIds.length === 0) {
        send(res, 200, { message: 'Nothing to update.' })
        return true
      }

      const placeholders = notificationIds.map(() => '?').join(',')
      await pool.query(
        `UPDATE notifications SET \`read\` = 1 WHERE id = ? AND notificationId IN (${placeholders})`,
        [userId, ...notificationIds],
      )
      send(res, 200, { message: 'Notifications marked read.' })
      return true
    } catch (error) {
      console.error('Mark notifications read error', error)
      send(res, 400, { message: 'Unable to mark notifications read.' })
      return true
    }
  }

  if (req.url === '/api/notifications' && req.method === 'POST') {
    try {
      const { userId, notification } = await parseBody(req)
      if (!userId || !notification) {
        send(res, 400, { message: 'userId and notification are required.' })
        return true
      }

      const notificationId = crypto.randomUUID()
      await pool.query(
        'INSERT INTO notifications (notificationId, id, notification, createdAt, `read`) VALUES (?, ?, ?, ?, ?)',
        [notificationId, userId, notification, new Date(), 0],
      )
      send(res, 201, { message: 'Notification created.', id: notificationId })
      return true
    } catch (error) {
      console.error('Create notification error', error)
      send(res, 400, { message: 'Unable to create notification.' })
      return true
    }
  }

  return false
}
