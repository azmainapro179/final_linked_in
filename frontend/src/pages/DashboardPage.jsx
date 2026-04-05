import Notifications from '../features/notifications/Notifications.jsx'

export default function DashboardPage({
  activeFilter,
  clearRecentSearches,
  companyResults,
  connected,
  feedSuggestions,
  followedCompanyIds,
  goToDashboard,
  handleAcceptInvite,
  handleCancelInvite,
  handleConnect,
  handleFilterChange,
  handleFollowCompany,
  handleLogout,
  handleRejectInvite,
  handleRemoveConnection,
  handleSuggestionSelect,
  handleTopSearchSubmit,
  handleUnfollowCompany,
  handleViewCompany,
  handleViewProfile,
  handleViewSchool,
  hasSearchInput,
  hasSubmittedSearch,
  homeFeedPosts,
  invited,
  jobResults,
  networkConnectedUsers,
  networkFollowedCompanies,
  networkFollowSuggestions,
  networkInvitedUsers,
  networkLoading,
  networkPendingUsers,
  networkSuggestions,
  networkView,
  onSearchDropdownClose,
  onSearchDropdownOpen,
  pending,
  recentSearches,
  schoolResults,
  searchDropdownItems,
  searchDropdownOpen,
  searchBlurTimeoutRef,
  searchFilters,
  searchLoading,
  searchQuery,
  searchResults,
  setHasSubmittedSearch,
  setNetworkView,
  setSearchQuery,
  setShowNotifications,
  showNotifications,
  userEmail,
  userHeadline,
  userId,
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
              placeholder="Search people, companies, schools, jobs..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
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
              autoComplete="off"
            />
            <button type="submit" className="search-btn" disabled={searchLoading}>
              {searchLoading ? '...' : '🔍'}
            </button>
            {searchDropdownOpen && (
              <div className="search-dropdown">
                <div className="search-dropdown-header">
                  <span>{searchQuery.trim().length >= 2 ? 'Suggestions' : 'Recent searches'}</span>
                  {searchQuery.trim().length < 2 && recentSearches.length > 0 && (
                    <button
                      type="button"
                      className="search-dropdown-clear"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={clearRecentSearches}
                    >
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
                          {item.type === 'job' && '💼'}
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
                  <div className="search-dropdown-empty">
                    {searchQuery.trim().length >= 2
                      ? 'No matching suggestions yet'
                      : 'Your recent searches will appear here'}
                  </div>
                )}
              </div>
            )}
          </form>
        </div>

        <div className="nav-right">
          <button
            className={`nav-chip ${activeFilter === 'all' ? 'active' : ''}`}
            onClick={goToDashboard}
          >
            Home
          </button>
          <button
            className={`nav-chip ${activeFilter === 'myNetwork' ? 'active' : ''}`}
            onClick={() => handleFilterChange('myNetwork')}
          >
            My Network
          </button>
          <div className="user-actions">
            <button
              className="notifications-btn"
              onClick={() => setShowNotifications((current) => !current)}
              title="Notifications"
            >
              🔔
            </button>
          </div>
          <div className="user-info">
            <span className="user-name">{userName}</span>
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </nav>

      {showNotifications && (
        <Notifications
          userId={userId}
          visible={showNotifications}
          onClose={() => setShowNotifications(false)}
        />
      )}

      {hasSubmittedSearch && (
        <div className="search-filters-bar">
          <div className="filters-container">
            {searchFilters.map((filter) => (
              <button
                key={filter.id}
                className={`filter-btn ${activeFilter === filter.id ? 'active' : ''} ${!filter.available ? 'disabled' : ''}`}
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
          <button
            type="button"
            className="profile-card own-profile-card"
            onClick={() => handleViewProfile(userId)}
          >
            <div className="avatar">{userName?.charAt(0)?.toUpperCase() || 'U'}</div>
            <h3>{userName}</h3>
            <p className="headline">{userHeadline}</p>
            <p className="email">{userEmail}</p>
          </button>

          <div className="filter-info-card">
            <h4>Quick links</h4>
            <div className="sidebar-filter-list">
              <button
                className={`sidebar-filter-item ${activeFilter === 'all' ? 'active' : ''}`}
                onClick={goToDashboard}
              >
                Home feed
              </button>
              <button
                className={`sidebar-filter-item ${activeFilter === 'people' ? 'active' : ''}`}
                onClick={() => handleFilterChange('people')}
              >
                Browse people
              </button>
              <button
                className={`sidebar-filter-item ${activeFilter === 'companies' ? 'active' : ''}`}
                onClick={() => handleFilterChange('companies')}
              >
                Browse companies
              </button>
              <button
                className={`sidebar-filter-item ${activeFilter === 'schools' ? 'active' : ''}`}
                onClick={() => handleFilterChange('schools')}
              >
                Browse schools
              </button>
              <button
                className={`sidebar-filter-item ${activeFilter === 'jobs' ? 'active' : ''}`}
                onClick={() => handleFilterChange('jobs')}
              >
                Browse jobs
              </button>
            </div>
          </div>
        </aside>

        <main className="dashboard-main">
          {activeFilter === 'all' && (
            <div className="search-section">
              <h2>{hasSearchInput ? 'Search Results' : 'Home'}</h2>
              <p className="subtext">
                {hasSearchInput
                  ? 'Pressing Enter searches people, companies, schools, and jobs by default.'
                  : 'This is the home feed. Posts and create-post are intentionally dummy only.'}
              </p>

              {searchQuery.length >= 2 && (
                <div className="search-results">
                  {searchLoading ? (
                    <div className="loading">Searching...</div>
                  ) : searchResults.length > 0 ||
                    companyResults.length > 0 ||
                    schoolResults.length > 0 ||
                    jobResults.length > 0 ? (
                    <div className="all-results">
                      {companyResults.length > 0 && (
                        <div className="result-group">
                          <div className="result-group-header">
                            <h3>🏢 Companies</h3>
                            <button className="see-all-btn" onClick={() => handleFilterChange('companies')}>
                              See all {companyResults.length} →
                            </button>
                          </div>
                          <div className="results-list">
                            {companyResults.slice(0, 3).map((company) => (
                              <div
                                key={company.id}
                                className="user-card company-card"
                                onClick={() => handleViewCompany(company.id)}
                              >
                                <div className="user-avatar company-logo">
                                  {company.logo || company.name?.charAt(0)?.toUpperCase()}
                                </div>
                                <div className="user-details">
                                  <h4>{company.name}</h4>
                                  <p className="user-headline">{company.industry}</p>
                                  <p className="company-location">📍 {company.location}</p>
                                </div>
                                <button
                                  className="view-btn"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleViewCompany(company.id)
                                  }}
                                >
                                  View Page →
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {searchResults.length > 0 && (
                        <div className="result-group">
                          <div className="result-group-header">
                            <h3>👥 People</h3>
                            <button className="see-all-btn" onClick={() => handleFilterChange('people')}>
                              See all {searchResults.length} →
                            </button>
                          </div>
                          <div className="results-list">
                            {searchResults.slice(0, 3).map((user) => (
                              <div
                                key={user.id}
                                className="user-card"
                                onClick={() => handleViewProfile(user.id)}
                              >
                                <div className="user-avatar">
                                  {user.fullName?.charAt(0)?.toUpperCase()}
                                </div>
                                <div className="user-details">
                                  <h4>{user.fullName}</h4>
                                  <p className="user-headline">{user.headline}</p>
                                </div>

                                {connected.includes(user.id) ? (
                                  <button
                                    className="connected-btn"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                    }}
                                  >
                                    connected
                                  </button>
                                ) : pending.includes(user.id) ? (
                                  <button
                                    className="pending-btn"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                    }}
                                  >
                                    pending
                                  </button>
                                ) : invited.includes(user.id) ? (
                                  <>
                                    <button
                                      className="accept-btn"
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        handleAcceptInvite(userId, user.id)
                                      }}
                                    >
                                      Accept
                                    </button>
                                    <button
                                      className="reject-btn"
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        handleRejectInvite(userId, user.id)
                                      }}
                                    >
                                      Reject
                                    </button>
                                  </>
                                ) : (
                                  <button
                                    className="view-btn"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      handleConnect(userId, user.id)
                                    }}
                                  >
                                    Connect+
                                  </button>
                                )}

                                <button
                                  className="view-btn"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleViewProfile(user.id)
                                  }}
                                >
                                  View Profile →
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {schoolResults.length > 0 && (
                        <div className="result-group">
                          <div className="result-group-header">
                            <h3>🎓 Schools</h3>
                            <button className="see-all-btn" onClick={() => handleFilterChange('schools')}>
                              See all {schoolResults.length} →
                            </button>
                          </div>
                          <div className="results-list">
                            {schoolResults.slice(0, 3).map((school) => (
                              <div
                                key={school.id}
                                className="user-card school-card"
                                onClick={() => handleViewSchool(school.id)}
                              >
                                <div className="user-avatar school-logo">
                                  {school.logo || school.name?.charAt(0)?.toUpperCase()}
                                </div>
                                <div className="user-details">
                                  <h4>{school.name}</h4>
                                  <p className="user-headline">{school.type}</p>
                                  <p className="school-location">📍 {school.location}</p>
                                </div>
                                <button
                                  className="view-btn"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleViewSchool(school.id)
                                  }}
                                >
                                  View Page →
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {jobResults.length > 0 && (
                        <div className="result-group">
                          <div className="result-group-header">
                            <h3>💼 Jobs</h3>
                            <button className="see-all-btn" onClick={() => handleFilterChange('jobs')}>
                              See all {jobResults.length} →
                            </button>
                          </div>
                          <div className="results-list">
                            {jobResults.slice(0, 3).map((job, index) => (
                              <div
                                key={`${job.userId}-${index}`}
                                className="user-card job-card"
                                onClick={() => handleViewProfile(job.userId)}
                              >
                                <div className="user-avatar job-logo">💼</div>
                                <div className="user-details">
                                  <h4>{job.title}</h4>
                                  <p className="job-company">🏢 {job.company}</p>
                                  <p className="job-person">👤 {job.personName}</p>
                                  <p className="job-years">{job.years}</p>
                                </div>
                                <button
                                  className="view-btn"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleViewProfile(job.userId)
                                  }}
                                >
                                  View Profile →
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="no-results">No results found for "{searchQuery}"</div>
                  )}
                </div>
              )}

              {searchQuery.length < 2 && (
                <div className="home-feed-shell">
                  <div className="home-composer-card">
                    <div className="composer-row">
                      <div className="mini-avatar">{userName?.charAt(0)?.toUpperCase() || 'U'}</div>
                      <button type="button" className="composer-trigger">
                        Start a post
                      </button>
                    </div>
                    <div className="composer-actions">
                      <button type="button" className="composer-action">Video</button>
                      <button type="button" className="composer-action">Photo</button>
                      <button type="button" className="composer-action">Write article</button>
                    </div>
                  </div>

                  <div className="home-feed-list">
                    {homeFeedPosts.map((post) => (
                      <article key={post.id} className="feed-card">
                        <div className="feed-header">
                          <div className="mini-avatar feed-avatar">
                            {post.author.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <h3>{post.author}</h3>
                            <p>{post.meta}</p>
                          </div>
                        </div>
                        <h4 className="feed-title">{post.headline}</h4>
                        <p className="feed-copy">{post.body}</p>
                        <div className="feed-image-placeholder">
                          <span>{post.imageTitle}</span>
                        </div>
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
                          <button type="button" className="follow-btn suggestion-follow-btn">
                            Follow
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeFilter === 'people' && (
            <div className="search-section">
              <h2>Find People</h2>
              <p className="subtext">Search for professionals by name, company, or role</p>

              {searchQuery.length >= 2 && (
                <div className="search-results">
                  {searchLoading ? (
                    <div className="loading">Searching...</div>
                  ) : searchResults.length > 0 ? (
                    <>
                      <p className="results-count">{searchResults.length} people found</p>
                      <div className="results-list">
                        {searchResults.map((user) => (
                          <div key={user.id} className="user-card" onClick={() => handleViewProfile(user.id)}>
                            <div className="user-avatar">{user.fullName?.charAt(0)?.toUpperCase()}</div>
                            <div className="user-details">
                              <h4>{user.fullName}</h4>
                              <p className="user-headline">{user.headline}</p>
                              <div className="user-skills">
                                {user.profile?.skills?.slice(0, 3).map((skill) => (
                                  <span key={skill} className="skill-tag">{skill}</span>
                                ))}
                              </div>
                            </div>

                            {connected.includes(user.id) ? (
                              <button className="connected-btn" onClick={(e) => e.stopPropagation()}>
                                connected
                              </button>
                            ) : pending.includes(user.id) ? (
                              <button className="pending-btn" onClick={(e) => e.stopPropagation()}>
                                pending
                              </button>
                            ) : invited.includes(user.id) ? (
                              <>
                                <button
                                  className="accept-btn"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleAcceptInvite(userId, user.id)
                                  }}
                                >
                                  Accept
                                </button>
                                <button
                                  className="reject-btn"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleRejectInvite(userId, user.id)
                                  }}
                                >
                                  Reject
                                </button>
                              </>
                            ) : (
                              <button
                                className="view-btn"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleConnect(userId, user.id)
                                }}
                              >
                                Connect+
                              </button>
                            )}

                            <button
                              className="view-btn"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleViewProfile(user.id)
                              }}
                            >
                              View Profile →
                            </button>
                          </div>
                        ))}
                      </div>
                    </>
                  ) : (
                    <div className="no-results">No users found for "{searchQuery}"</div>
                  )}
                </div>
              )}

              {searchQuery.length < 2 && (
                <div className="search-hint">
                  <p>👆 Type at least 2 characters to search</p>
                  <p className="hint-examples">
                    Try: "Google", "Engineer", "Rahul", "React"
                  </p>
                </div>
              )}
            </div>
          )}

          {activeFilter === 'companies' && (
            <div className="search-section">
              <h2>Find Companies</h2>
              <p className="subtext">Search for companies by name, industry, or location</p>

              {searchQuery.length >= 2 && (
                <div className="search-results">
                  {searchLoading ? (
                    <div className="loading">Searching...</div>
                  ) : companyResults.length > 0 ? (
                    <>
                      <p className="results-count">{companyResults.length} companies found</p>
                      <div className="results-list">
                        {companyResults.map((company) => (
                          <div
                            key={company.id}
                            className="user-card company-card"
                            onClick={() => handleViewCompany(company.id)}
                          >
                            <div className="user-avatar company-logo">
                              {company.logo || company.name?.charAt(0)?.toUpperCase()}
                            </div>
                            <div className="user-details">
                              <h4>{company.name}</h4>
                              <p className="user-headline">{company.industry}</p>
                              <p className="company-location">📍 {company.location}</p>
                              <p className="company-followers">
                                👥 {(company.followers / 1000000).toFixed(1)}M followers
                              </p>
                            </div>
                            <button
                              className="view-btn"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleViewCompany(company.id)
                              }}
                            >
                              View Page →
                            </button>
                          </div>
                        ))}
                      </div>
                    </>
                  ) : (
                    <div className="no-results">No companies found for "{searchQuery}"</div>
                  )}
                </div>
              )}

              {searchQuery.length < 2 && (
                <div className="search-hint">
                  <p>👆 Type at least 2 characters to search</p>
                  <p className="hint-examples">
                    Try: "Google", "Amazon", "Microsoft", "bKash", "Software"
                  </p>
                </div>
              )}
            </div>
          )}

          {activeFilter === 'schools' && (
            <div className="search-section">
              <h2>Find Schools</h2>
              <p className="subtext">Search for universities and educational institutions</p>

              {searchQuery.length >= 2 && (
                <div className="search-results">
                  {searchLoading ? (
                    <div className="loading">Searching...</div>
                  ) : schoolResults.length > 0 ? (
                    <>
                      <p className="results-count">{schoolResults.length} schools found</p>
                      <div className="results-list">
                        {schoolResults.map((school) => (
                          <div
                            key={school.id}
                            className="user-card school-card"
                            onClick={() => handleViewSchool(school.id)}
                          >
                            <div className="user-avatar school-logo">
                              {school.logo || school.name?.charAt(0)?.toUpperCase()}
                            </div>
                            <div className="user-details">
                              <h4>{school.name}</h4>
                              <p className="user-headline">{school.type}</p>
                              <p className="school-location">📍 {school.location}</p>
                              <p className="school-followers">
                                👥 {school.followers >= 1000000
                                  ? `${(school.followers / 1000000).toFixed(1)}M`
                                  : `${(school.followers / 1000).toFixed(0)}K`} followers
                              </p>
                            </div>
                            <button
                              className="view-btn"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleViewSchool(school.id)
                              }}
                            >
                              View Page →
                            </button>
                          </div>
                        ))}
                      </div>
                    </>
                  ) : (
                    <div className="no-results">No schools found for "{searchQuery}"</div>
                  )}
                </div>
              )}

              {searchQuery.length < 2 && (
                <div className="search-hint">
                  <p>👆 Type at least 2 characters to search</p>
                  <p className="hint-examples">
                    Try: "BUET", "Harvard", "MIT", "Stanford", "University"
                  </p>
                </div>
              )}
            </div>
          )}

          {activeFilter === 'jobs' && (
            <div className="search-section">
              <h2>Find Jobs</h2>
              <p className="subtext">Search for job positions and work opportunities</p>

              {searchQuery.length >= 2 && (
                <div className="search-results">
                  {searchLoading ? (
                    <div className="loading">Searching...</div>
                  ) : jobResults.length > 0 ? (
                    <>
                      <p className="results-count">{jobResults.length} jobs found</p>
                      <div className="results-list">
                        {jobResults.map((job, index) => (
                          <div
                            key={`${job.userId}-${index}`}
                            className="user-card job-card"
                            onClick={() => handleViewProfile(job.userId)}
                          >
                            <div className="user-avatar job-logo">💼</div>
                            <div className="user-details">
                              <h4>{job.title}</h4>
                              <p className="job-company">🏢 {job.company}</p>
                              <p className="job-person">👤 {job.personName}</p>
                              <p className="job-years">{job.years}</p>
                            </div>
                            <button
                              className="view-btn"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleViewProfile(job.userId)
                              }}
                            >
                              View Profile →
                            </button>
                          </div>
                        ))}
                      </div>
                    </>
                  ) : (
                    <div className="no-results">No jobs found for "{searchQuery}"</div>
                  )}
                </div>
              )}

              {searchQuery.length < 2 && (
                <div className="search-hint">
                  <p>👆 Type at least 2 characters to search</p>
                  <p className="hint-examples">
                    Try: "Engineer", "Developer", "Google", "Manager", "Analyst"
                  </p>
                </div>
              )}
            </div>
          )}

          {activeFilter === 'myNetwork' && (
            <div className="search-section my-network-section">
              <h2>My Network</h2>
              <p className="subtext">
                Manage your pending requests, connections, followed companies, and tailored
                suggestions
              </p>

              <div className="network-controls">
                <button
                  className={`network-tab ${networkView === 'pending' ? 'active' : ''}`}
                  onClick={() => setNetworkView('pending')}
                >
                  Pending ({pending.length})
                </button>
                <button
                  className={`network-tab ${networkView === 'invitations' ? 'active' : ''}`}
                  onClick={() => setNetworkView('invitations')}
                >
                  Invitations ({invited.length})
                </button>
                <button
                  className={`network-tab ${networkView === 'connections' ? 'active' : ''}`}
                  onClick={() => setNetworkView('connections')}
                >
                  Connections ({connected.length})
                </button>
                <button
                  className={`network-tab ${networkView === 'following' ? 'active' : ''}`}
                  onClick={() => setNetworkView('following')}
                >
                  Following ({followedCompanyIds.length})
                </button>
              </div>

              <div className="network-list">
                {networkLoading ? (
                  <div className="loading">Loading...</div>
                ) : networkView === 'pending' ? (
                  networkPendingUsers.length ? (
                    <div className="results-list">
                      {networkPendingUsers.map((user) => (
                        <div key={user.id} className="user-card">
                          <div className="user-avatar">{user.fullName?.charAt(0)?.toUpperCase()}</div>
                          <div className="user-details">
                            <h4>{user.fullName}</h4>
                            <p className="user-headline">{user.headline}</p>
                          </div>
                          <button
                            className="cancel-btn"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleCancelInvite(userId, user.id)
                            }}
                          >
                            Cancel
                          </button>
                          <button
                            className="view-btn"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleViewProfile(user.id)
                            }}
                          >
                            View Profile →
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="no-results">No pending requests</div>
                  )
                ) : networkView === 'invitations' ? (
                  networkInvitedUsers.length ? (
                    <div className="results-list">
                      {networkInvitedUsers.map((user) => (
                        <div key={user.id} className="user-card">
                          <div className="user-avatar">{user.fullName?.charAt(0)?.toUpperCase()}</div>
                          <div className="user-details">
                            <h4>{user.fullName}</h4>
                            <p className="user-headline">{user.headline}</p>
                          </div>
                          <button
                            className="accept-btn"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleAcceptInvite(userId, user.id)
                            }}
                          >
                            Accept
                          </button>
                          <button
                            className="reject-btn"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleRejectInvite(userId, user.id)
                            }}
                          >
                            Reject
                          </button>
                          <button
                            className="view-btn"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleViewProfile(user.id)
                            }}
                          >
                            View Profile →
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="no-results">No invitations</div>
                  )
                ) : networkView === 'connections' ? (
                  networkConnectedUsers.length ? (
                    <div className="results-list">
                      {networkConnectedUsers.map((user) => (
                        <div key={user.id} className="user-card">
                          <div className="user-avatar">{user.fullName?.charAt(0)?.toUpperCase()}</div>
                          <div className="user-details">
                            <h4>{user.fullName}</h4>
                            <p className="user-headline">{user.headline}</p>
                          </div>
                          <button
                            className="connected-btn"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleViewProfile(user.id)
                            }}
                          >
                            connected
                          </button>
                          <button
                            className="remove-connection-btn"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleRemoveConnection(userId, user.id)
                            }}
                          >
                            remove
                          </button>
                          <button
                            className="view-btn"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleViewProfile(user.id)
                            }}
                          >
                            View Profile →
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="no-results">No connections yet</div>
                  )
                ) : networkFollowedCompanies.length ? (
                  <div className="results-list">
                    {networkFollowedCompanies.map((company) => (
                      <div key={company.id} className="user-card company-card network-company-card">
                        <div className="user-avatar company-logo">
                          {company.logo || company.name?.charAt(0)?.toUpperCase()}
                        </div>
                        <div className="user-details">
                          <h4>{company.name}</h4>
                          <p className="user-headline">{company.industry}</p>
                          <p className="company-location">📍 {company.location}</p>
                        </div>
                        <button className="follow-btn network-following-btn">Following</button>
                        <button
                          className="remove-connection-btn"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleUnfollowCompany(company.id)
                          }}
                        >
                          unfollow
                        </button>
                        <button
                          className="view-btn"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleViewCompany(company.id)
                          }}
                        >
                          View Page →
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="no-results">No followed companies yet</div>
                )}
              </div>

              {networkSuggestions.length > 0 && (
                <div className="network-suggestions-panel">
                  <div className="network-suggestions-header">
                    <div>
                      <h3>Connection suggestions</h3>
                      <p>People surfaced from your network and profile matches</p>
                    </div>
                  </div>
                  <div className="results-list">
                    {networkSuggestions.map((user) => (
                      <div key={user.id} className="user-card network-suggestion-card">
                        <div className="user-avatar">{user.fullName?.charAt(0)?.toUpperCase()}</div>
                        <div className="user-details">
                          <h4>{user.fullName}</h4>
                          <p className="user-headline">{user.headline}</p>
                          {user.reasons?.length > 0 && (
                            <div className="network-reasons">
                              {user.reasons.map((reason) => (
                                <span key={`${user.id}-${reason}`} className="network-reason-chip">
                                  {reason}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                        {pending.includes(user.id) ? (
                          <button className="pending-btn">pending</button>
                        ) : invited.includes(user.id) ? (
                          <button
                            className="accept-btn"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleAcceptInvite(userId, user.id)
                            }}
                          >
                            Accept
                          </button>
                        ) : (
                          <button
                            className="view-btn"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleConnect(userId, user.id)
                            }}
                          >
                            Connect+
                          </button>
                        )}
                        <button
                          className="view-btn"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleViewProfile(user.id)
                          }}
                        >
                          View Profile →
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {networkFollowSuggestions.length > 0 && (
                <div className="network-suggestions-panel">
                  <div className="network-suggestions-header">
                    <div>
                      <h3>Company follow suggestions</h3>
                      <p>Suggested from companies you follow plus the companies tied to your network</p>
                    </div>
                  </div>
                  <div className="results-list">
                    {networkFollowSuggestions.map((company) => (
                      <div
                        key={company.id}
                        className="user-card company-card network-company-card network-suggestion-card"
                      >
                        <div className="user-avatar company-logo">
                          {company.logo || company.name?.charAt(0)?.toUpperCase()}
                        </div>
                        <div className="user-details">
                          <h4>{company.name}</h4>
                          <p className="user-headline">{company.industry}</p>
                          <p className="company-location">📍 {company.location}</p>
                          {company.reasons?.length > 0 && (
                            <div className="network-reasons">
                              {company.reasons.map((reason) => (
                                <span key={`${company.id}-${reason}`} className="network-reason-chip">
                                  {reason}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                        {followedCompanyIds.includes(company.id) ? (
                          <button className="follow-btn network-following-btn">Following</button>
                        ) : (
                          <button
                            className="follow-btn"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleFollowCompany(company.id)
                            }}
                          >
                            + Follow
                          </button>
                        )}
                        <button
                          className="view-btn"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleViewCompany(company.id)
                          }}
                        >
                          View Page →
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {!['all', 'people', 'companies', 'schools', 'jobs', 'myNetwork'].includes(activeFilter) && (
            <div className="search-section coming-soon-section">
              <div className="coming-soon-content">
                <span className="coming-soon-icon">
                  {searchFilters.find((filter) => filter.id === activeFilter)?.icon}
                </span>
                <h2>{searchFilters.find((filter) => filter.id === activeFilter)?.label}</h2>
                <p className="subtext">This feature is coming soon!</p>
                <div className="coming-soon-info">
                  <p>
                    We&apos;re working hard to bring you the best{' '}
                    {searchFilters.find((filter) => filter.id === activeFilter)?.label.toLowerCase()}{' '}
                    search experience.
                  </p>
                  <button className="back-to-people-btn" onClick={() => handleFilterChange('all')}>
                    ← Back to Search
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
