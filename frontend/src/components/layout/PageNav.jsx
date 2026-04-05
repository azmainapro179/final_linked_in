function PageNav({ userName, onBrandClick, onBack, onLogout }) {
  return (
    <nav className="dashboard-nav">
      <div className="nav-left">
        <div className="wordmark" onClick={onBrandClick} style={{ cursor: 'pointer' }}>
          <div className="mark">in</div>
          <span className="brand">LINKEDIN</span>
        </div>
      </div>

      <div className="nav-center">
        <button className="back-btn" onClick={onBack}>
          ← Back to Search
        </button>
      </div>

      <div className="nav-right">
        <div className="user-info">
          <span className="user-name">{userName}</span>
          <button className="logout-btn" onClick={onLogout}>
            Logout
          </button>
        </div>
      </div>
    </nav>
  )
}

export default PageNav
