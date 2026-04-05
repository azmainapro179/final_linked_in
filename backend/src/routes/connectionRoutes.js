import crypto from 'node:crypto'

export async function handleConnectionRoutes(req, res, context) {
  const { parseBody, pool, send } = context

  if (req.url === '/api/accept-invite' && req.method === 'POST') {
    try {
      const { userId, inviterId } = await parseBody(req)
      if (!userId || !inviterId) {
        send(res, 400, { message: 'User ID and Inviter ID are required.' })
        return true
      }

      await pool.query(
        'UPDATE connections SET connected = JSON_ARRAY_PUSH_STRING(connected, ?) WHERE id = ?',
        [inviterId, userId],
      )
      await pool.query(
        'UPDATE connections SET connected = JSON_ARRAY_PUSH_STRING(connected, ?) WHERE id = ?',
        [userId, inviterId],
      )

      const [userName] = await pool.query('SELECT fullName FROM users WHERE id = ? LIMIT 1', [userId])
      const [userConnections] = await pool.query(
        'SELECT pending, connected, invited FROM connections WHERE id = ? LIMIT 1',
        [userId],
      )
      const [inviterConnections] = await pool.query(
        'SELECT pending, connected, invited FROM connections WHERE id = ? LIMIT 1',
        [inviterId],
      )

      const userInvited = userConnections[0]?.invited || []
      const inviterPending = inviterConnections[0]?.pending || []
      await pool.query('UPDATE connections SET invited = ? WHERE id = ?', [
        JSON.stringify(userInvited.filter((id) => id !== inviterId)),
        userId,
      ])
      await pool.query('UPDATE connections SET pending = ? WHERE id = ?', [
        JSON.stringify(inviterPending.filter((id) => id !== userId)),
        inviterId,
      ])

      const notificationId = crypto.randomUUID()
      const notification = `${userName[0].fullName} accepted your invitation.`
      await pool.query(
        'INSERT INTO notifications (notificationId, id, notification, createdAt, `read`) VALUES (?, ?, ?, ?, ?)',
        [notificationId, inviterId, notification, new Date(), 0],
      )

      send(res, 200, { message: 'Invite accepted successfully.' })
      return true
    } catch (error) {
      console.error('Accept invite error', error)
      send(res, 400, { message: 'Invalid accept invite payload.' })
      return true
    }
  }

  if (req.url === '/api/reject-invite' && req.method === 'POST') {
    try {
      const { userId, inviterId } = await parseBody(req)
      if (!userId || !inviterId) {
        send(res, 400, { message: 'User ID and Inviter ID are required.' })
        return true
      }

      const [userConnections] = await pool.query(
        'SELECT pending, connected, invited FROM connections WHERE id = ? LIMIT 1',
        [userId],
      )
      const [inviterConnections] = await pool.query(
        'SELECT pending, connected, invited FROM connections WHERE id = ? LIMIT 1',
        [inviterId],
      )
      const userInvited = userConnections[0]?.invited || []
      const inviterPending = inviterConnections[0]?.pending || []

      await pool.query('UPDATE connections SET invited = ? WHERE id = ?', [
        JSON.stringify(userInvited.filter((id) => id !== inviterId)),
        userId,
      ])
      await pool.query('UPDATE connections SET pending = ? WHERE id = ?', [
        JSON.stringify(inviterPending.filter((id) => id !== userId)),
        inviterId,
      ])

      send(res, 200, { message: 'Invite rejected successfully.' })
      return true
    } catch (error) {
      console.error('Reject invite error', error)
      send(res, 400, { message: 'Invalid reject invite payload.' })
      return true
    }
  }

  if (req.url === '/api/cancel-invite' && req.method === 'POST') {
    try {
      const { userId, inviteeId } = await parseBody(req)
      if (!userId || !inviteeId) {
        send(res, 400, { message: 'User ID and Invitee ID are required.' })
        return true
      }

      const [userConnections] = await pool.query(
        'SELECT pending, connected, invited FROM connections WHERE id = ? LIMIT 1',
        [userId],
      )
      const [inviteeConnections] = await pool.query(
        'SELECT pending, connected, invited FROM connections WHERE id = ? LIMIT 1',
        [inviteeId],
      )
      const userPending = userConnections[0]?.pending || []
      const inviteeInvited = inviteeConnections[0]?.invited || []

      await pool.query('UPDATE connections SET pending = ? WHERE id = ?', [
        JSON.stringify(userPending.filter((id) => id !== inviteeId)),
        userId,
      ])
      await pool.query('UPDATE connections SET invited = ? WHERE id = ?', [
        JSON.stringify(inviteeInvited.filter((id) => id !== userId)),
        inviteeId,
      ])

      send(res, 200, { message: 'Invite cancelled successfully.' })
      return true
    } catch (error) {
      console.error('cancel invite error', error)
      send(res, 400, { message: 'Invalid cancel invite payload.' })
      return true
    }
  }

  if (req.url === '/api/remove-connection' && req.method === 'POST') {
    try {
      const { userId, connectionId } = await parseBody(req)
      if (!userId || !connectionId) {
        send(res, 400, { message: 'User ID and connection ID are required.' })
        return true
      }

      const [userConnections] = await pool.query(
        'SELECT pending, connected, invited FROM connections WHERE id = ? LIMIT 1',
        [userId],
      )
      const [connectionRows] = await pool.query(
        'SELECT pending, connected, invited FROM connections WHERE id = ? LIMIT 1',
        [connectionId],
      )
      const userConnected = userConnections[0]?.connected || []
      const connectionConnected = connectionRows[0]?.connected || []

      await pool.query('UPDATE connections SET connected = ? WHERE id = ?', [
        JSON.stringify(userConnected.filter((id) => id !== connectionId)),
        userId,
      ])
      await pool.query('UPDATE connections SET connected = ? WHERE id = ?', [
        JSON.stringify(connectionConnected.filter((id) => id !== userId)),
        connectionId,
      ])

      send(res, 200, { message: 'Connection removed successfully.' })
      return true
    } catch (error) {
      console.error('connection remove error', error)
      send(res, 400, { message: 'Invalid connection remove payload.' })
      return true
    }
  }

  if (req.url === '/api/send-invite' && req.method === 'POST') {
    try {
      const { userId, inviteeId } = await parseBody(req)
      if (!userId || !inviteeId) {
        send(res, 400, { message: 'User ID and Invitee ID are required.' })
        return true
      }
      if (userId === inviteeId) {
        send(res, 400, { message: 'You cannot send an invite to yourself.' })
        return true
      }

      const [senderName] = await pool.query('SELECT fullName FROM users WHERE id = ? LIMIT 1', [userId])

      await pool.query(
        'UPDATE connections SET pending = JSON_ARRAY_PUSH_STRING(pending, ?) WHERE id = ?',
        [inviteeId, userId],
      )
      await pool.query(
        'UPDATE connections SET invited = JSON_ARRAY_PUSH_STRING(invited, ?) WHERE id = ?',
        [userId, inviteeId],
      )

      const notificationId = crypto.randomUUID()
      const notification = `${senderName[0].fullName} sent you an invitation.`
      await pool.query(
        'INSERT INTO notifications (notificationId, id, notification, createdAt, `read`) VALUES (?, ?, ?, ?, ?)',
        [notificationId, inviteeId, notification, new Date(), 0],
      )

      send(res, 200, { message: 'Invite sent successfully.' })
      return true
    } catch (error) {
      console.error('Send invite error', error)
      send(res, 400, { message: 'Invalid send invite payload.' })
      return true
    }
  }

  return false
}
