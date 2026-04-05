import { useEffect, useState, useRef, useCallback } from 'react'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000'

export default function Notifications({ userId, visible = false, onClose = () => {} }) {
  const LIMIT = 10
  const [notifications, setNotifications] = useState([])
  const [offset, setOffset] = useState(0)
  const [hasMore, setHasMore] = useState(false)
  const [loading, setLoading] = useState(false)
  const observerRef = useRef(null)
  const batchRef = useRef(new Set())
  const batchTimerRef = useRef(null)
  const containerRef = useRef(null)
  const loadingRef = useRef(false)

  const fetchNotifications = useCallback(async (reset = false, nextOffset = 0) => {
    if (!userId || loadingRef.current) return
    loadingRef.current = true
    setLoading(true)
    try {
      const curOffset = reset ? 0 : nextOffset
      const r = await fetch(`${API_BASE}/api/notifications?userId=${userId}&limit=${LIMIT}&offset=${curOffset}`)
      const d = await r.json().catch(() => ({}))
      const items = d.notifications || []
      setHasMore(!!d.hasMore)
      if (reset) {
        setNotifications(items)
        setOffset(items.length)
      } else {
        setNotifications((current) => {
          const seen = new Set(current.map((item) => item.id))
          const nextItems = items.filter((item) => !seen.has(item.id))
          return [...current, ...nextItems]
        })
        setOffset((current) => current + items.length)
      }
    } catch (err) {
      console.error('Fetch notifications error', err)
    } finally {
      loadingRef.current = false
      setLoading(false)
    }
  }, [userId])

  useEffect(() => {
    if (visible) {
      setOffset(0)
      setNotifications([])
      setHasMore(false)
      fetchNotifications(true, 0)
    }
  }, [visible, fetchNotifications])

  // Intersection observer to detect when a notification item becomes visible
  useEffect(() => {
    if (!visible) return

    if (observerRef.current) {
      observerRef.current.disconnect()
    }

    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target
          const id = el.dataset?.id
          const read = el.dataset?.read === '1'
          if (!read && id) {
            batchRef.current.add(id)
          }
        }
      })
      if (batchRef.current.size > 0) {
        // debounce batching
        if (batchTimerRef.current) clearTimeout(batchTimerRef.current)
        batchTimerRef.current = setTimeout(async () => {
          const ids = Array.from(batchRef.current)
          batchRef.current.clear()
          await markNotificationsRead(ids)
        }, 250)
      }
    }, { root: containerRef.current, threshold: 0.4 })

    // observe visible notification elements
    const items = containerRef.current?.querySelectorAll('.notification-item') || []
    items.forEach((item) => observerRef.current.observe(item))

    return () => {
      if (observerRef.current) observerRef.current.disconnect()
      if (batchTimerRef.current) clearTimeout(batchTimerRef.current)
    }
  }, [visible, notifications, markNotificationsRead])

  const markNotificationsRead = useCallback(async (ids = []) => {
    if (!userId || !ids.length) return
    try {
      const response = await fetch(`${API_BASE}/api/notifications/mark-read`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, notificationIds: ids })
      })
      if (!response.ok) {
        throw new Error('Unable to mark notifications as read.')
      }
      setNotifications((current) => current.map((n) => (ids.includes(n.id) ? { ...n, read: 1 } : n)))
    } catch (err) {
      console.error('Error marking notifications read', err)
    }
  }, [userId])

  const handleLoadMore = async () => {
    if (loading || !hasMore) return
    await fetchNotifications(false, offset)
  }

  const formattedDate = (isoDate) => {
    try {
      const d = new Date(isoDate)
      return d.toLocaleString()
    } catch {
      return isoDate
    }
  }

  return (
    <div className={`notifications-panel ${visible ? 'open' : ''}`}>
      <div className="notifications-header">
        <h3>Notifications</h3>
        <button className="close-btn" onClick={onClose} aria-label="Close notifications">x</button>
      </div>
      <div className="notifications-scroll" ref={containerRef}>
        {loading && notifications.length === 0 ? (
          <div className="loading">Loading...</div>
        ) : notifications.length === 0 ? (
          <div className="no-results">You're all caught up!</div>
        ) : (
          <div className="notifications-list">
            {notifications.map((n) => (
              <div
                key={n.id}
                data-id={n.id}
                data-read={n.read ? '1' : '0'}
                className={`notification-item ${n.read ? 'read' : 'unread'}`}
              >
                {!n.read && <span className="dot" />}
                <div className="notification-content">
                  <div className="notification-text">{n.notification}</div>
                  <div className="notification-date">{formattedDate(n.createdAt)}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="notifications-footer">
        {hasMore ? (
          <button className="load-more-btn" disabled={loading} onClick={handleLoadMore}>
            {loading ? 'Loading...' : 'Load more'}
          </button>
        ) : (
          <div className="end-msg">No more notifications</div>
        )}
      </div>
    </div>
  )
}
