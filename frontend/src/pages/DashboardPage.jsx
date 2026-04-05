export default function DashboardPage({
  activeFilter,
  clearRecentSearches,
  feedSuggestions,
  goToDashboard,
  handleFilterChange,
  handleLogout,
  handleSuggestionSelect,
  handleTopSearchSubmit,
  hasSubmittedSearch,
  hasSearchInput,
  homeFeedPosts,
  onSearchDropdownClose,
  onSearchDropdownOpen,
  onViewOwnProfile,
  recentSearches,
  searchBlurTimeoutRef,
  searchDropdownItems,
  searchDropdownOpen,
  searchFilters,
  searchQuery,
  searchResults,
  setHasSubmittedSearch,
  setSearchQuery,
  userEmail,
  userHeadline,
  userName,
}) {
  return (
    <div className="page dashboard-page">
      <div className="halo" />
      <div className="grid-accent" />

      <nav className="dashboard-nav">
        <div className="nav-left">
          <div className="wordmark" onClick={goToDashboard} style={{ cursor: 'pointer' }}>
            <div className="mark">in</div>
            <span className="brand">LINKEDIN</span>
          </div>
        </div>

        <div className="nav-center">
          <form className="search-form" onSubmit={handleTopSearchSubmit}>
            <input
              type="text"
              placeholder="Search people, companies, or schools..."
              value={searchQuery}
              onChange={(event) => {
                setSearchQuery(event.target.value)
                setHasSubmittedSearch(false)
              }}
              onFocus={() => {
                window.clearTimeout(searchBlurTimeoutRef.current)
                onSearchDropdownOpen()
              }}
              onBlur={() => {
                searchBlurTimeoutRef.current = window.setTimeout(() => {
                  onSearchDropdownClose()
                }, 140)
              }}
              className="search-input"
            />
            <button type="submit" className="search-btn">
              🔍
            </button>

            {searchDropdownOpen && (
              <div className="search-dropdown">
                <div className="search-dropdown-header">
                  <span>{searchQuery.trim().length >= 2 ? 'Suggestions' : 'Recent searches'}</span>
                  {searchQuery.trim().length < 2 && recentSearches.length > 0 && (
                    <button type="button" className="search-dropdown-clear" onMouseDown={(e) => e.preventDefault()} onClick={clearRecentSearches}>
                      Clear
                    </button>
                  )}
                </div>
                {searchDropdownItems.length > 0 ? (
                  <div className="search-dropdown-list">
                    {searchDropdownItems.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        className="search-dropdown-item"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => handleSuggestionSelect(item)}
                      >
                        <span className="search-dropdown-icon">
                          {item.type === 'person' && '👤'}
                          {item.type === 'company' && '🏢'}
                          {item.type === 'school' && '🎓'}
                          {item.type === 'recent' && '🕘'}
                        </span>
                        <span className="search-dropdown-copy">
                          <strong>{item.title}</strong>
                          <small>{item.subtitle}</small>
                        </span>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="search-dropdown-empty">Nothing to suggest yet</div>
                )}
              </div>
            )}
          </form>
        </div>

        <div className="nav-right">
          <button className={`nav-chip ${activeFilter === 'all' ? 'active' : ''}`} onClick={goToDashboard}>
            Home
          </button>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </nav>

      {hasSubmittedSearch && (
        <div className="search-filters-bar">
          <div className="filters-container">
            {searchFilters.slice(0, 4).map((filter) => (
              <button
                key={filter.id}
                className={`filter-btn ${activeFilter === filter.id ? 'active' : ''}`}
                onClick={() => handleFilterChange(filter.id)}
              >
                <span className="filter-icon">{filter.icon}</span>
                <span className="filter-label">{filter.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="dashboard-content">
        <aside className="dashboard-sidebar">
          <button type="button" className="profile-card own-profile-card" onClick={onViewOwnProfile}>
            <div className="avatar">{userName?.charAt(0)?.toUpperCase() || 'M'}</div>
            <h3>{userName}</h3>
            <p className="headline">{userHeadline}</p>
            <p className="email">{userEmail}</p>
          </button>
        </aside>

        <main className="dashboard-main">
          <div className="search-section">
            <h2>{hasSearchInput ? 'Search Results' : 'Home'}</h2>
            <p className="subtext">
              Version 2 adds the dashboard, quick links, live suggestions, and simple result filtering.
            </p>

            {hasSubmittedSearch ? (
              searchResults.length > 0 ? (
                <div className="results-list">
                  {searchResults.map((item) => (
                    <div key={item.id} className="user-card">
                      <div className="user-avatar">{item.title.charAt(0).toUpperCase()}</div>
                      <div className="user-details">
                        <h4>{item.title}</h4>
                        <p className="user-headline">{item.subtitle}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="no-results">No results found for "{searchQuery}"</div>
              )
            ) : (
              <div className="home-feed-shell">
                <div className="home-feed-list">
                  {homeFeedPosts.map((post) => (
                    <article key={post.id} className="feed-card">
                      <div className="feed-header">
                        <div className="mini-avatar feed-avatar">{post.author.charAt(0).toUpperCase()}</div>
                        <div>
                          <h3>{post.author}</h3>
                          <p>{post.meta}</p>
                        </div>
                      </div>
                      <h4 className="feed-title">{post.headline}</h4>
                      <p className="feed-copy">{post.body}</p>
                    </article>
                  ))}
                </div>

                <div className="right-rail-card mobile-feed-suggestions">
                  <h3>Add to your feed</h3>
                  <div className="feed-suggestions">
                    {feedSuggestions.map((item) => (
                      <div key={item.id} className="suggestion-item">
                        <div className="suggestion-avatar">{item.name.charAt(0).toUpperCase()}</div>
                        <div className="suggestion-copy">
                          <strong>{item.name}</strong>
                          <span>{item.caption}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
