import { useMemo, useRef, useState } from 'react'
import './App.css'
import {
  feedSuggestions,
  highlights,
  homeFeedPosts,
  searchFilters,
  starterForm,
} from './config/appConstants.js'
import DashboardPage from './pages/DashboardPage.jsx'

const directory = [
  { id: 'person-1', type: 'person', title: 'Amina Rahman', subtitle: 'Product Designer' },
  { id: 'person-2', type: 'person', title: 'Tahmid Islam', subtitle: 'Frontend Engineer' },
  { id: 'company-1', type: 'company', title: 'bKash', subtitle: 'Financial Services' },
  { id: 'school-1', type: 'school', title: 'BUET', subtitle: 'University' },
]

function App() {
  const [view, setView] = useState('auth')
  const [mode, setMode] = useState('signin')
  const [form, setForm] = useState(starterForm)
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState({ type: 'idle', message: '' })
  const [userName, setUserName] = useState('')
  const [userEmail, setUserEmail] = useState('')
  const [userHeadline, setUserHeadline] = useState('')
  const [activeFilter, setActiveFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [searchDropdownOpen, setSearchDropdownOpen] = useState(false)
  const [recentSearches, setRecentSearches] = useState(['Product design', 'bKash'])
  const [hasSubmittedSearch, setHasSubmittedSearch] = useState(false)
  const searchBlurTimeoutRef = useRef(null)

  const formTitle = mode === 'signin' ? 'Welcome back' : 'Create your account'
  const ctaLabel = mode === 'signin' ? 'Sign in' : 'Create account'
  const heroHeadline = useMemo(
    () =>
      mode === 'signin'
        ? 'Version 2 introduces the dashboard and discovery surface.'
        : 'Search and feed UI now sit on top of the original app shell.',
    [mode],
  )

  const searchDropdownItems = searchQuery.trim().length >= 2
    ? directory.filter((item) => item.title.toLowerCase().includes(searchQuery.trim().toLowerCase()))
    : recentSearches.map((item, index) => ({
        id: `recent-${index}`,
        type: 'recent',
        title: item,
        subtitle: 'Recent search',
      }))

  const searchResults = directory.filter((item) => {
    if (!hasSubmittedSearch) return false
    if (!searchQuery.trim()) return false
    if (activeFilter === 'all') return item.title.toLowerCase().includes(searchQuery.toLowerCase())
    return item.type === activeFilter.slice(0, -1) && item.title.toLowerCase().includes(searchQuery.toLowerCase())
  })

  const updateField = (field) => (event) => {
    setForm((current) => ({ ...current, [field]: event.target.value }))
  }

  const switchMode = (nextMode) => {
    setMode(nextMode)
    setForm(starterForm)
    setStatus({ type: 'idle', message: '' })
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!form.email.trim() || !form.password.trim()) {
      setStatus({ type: 'error', message: 'Email and password are required.' })
      return
    }

    setLoading(true)
    setStatus({ type: 'pending', message: 'Loading the dashboard experience...' })
    await new Promise((resolve) => window.setTimeout(resolve, 150))
    setUserName(form.fullName.trim() || 'Member Two')
    setUserEmail(form.email.trim())
    setUserHeadline(form.headline.trim() || 'Dashboard and Discovery UX')
    setView('dashboard')
    setLoading(false)
    setStatus({ type: 'success', message: 'Ready.' })
  }

  const handleSuggestionSelect = (item) => {
    setSearchQuery(item.title)
    setSearchDropdownOpen(false)
  }

  const handleTopSearchSubmit = (event) => {
    event.preventDefault()
    if (!searchQuery.trim()) return
    setHasSubmittedSearch(true)
    setRecentSearches((current) => [searchQuery.trim(), ...current.filter((item) => item !== searchQuery.trim())].slice(0, 5))
  }

  const handleFilterChange = (nextFilter) => {
    setActiveFilter(nextFilter)
  }

  if (view === 'dashboard') {
    return (
      <DashboardPage
        activeFilter={activeFilter}
        clearRecentSearches={() => setRecentSearches([])}
        feedSuggestions={feedSuggestions}
        goToDashboard={() => {
          setActiveFilter('all')
          setSearchQuery('')
          setHasSubmittedSearch(false)
        }}
        handleFilterChange={handleFilterChange}
        handleLogout={() => {
          setView('auth')
          setForm(starterForm)
        }}
        handleSuggestionSelect={handleSuggestionSelect}
        handleTopSearchSubmit={handleTopSearchSubmit}
        hasSubmittedSearch={hasSubmittedSearch}
        hasSearchInput={searchQuery.trim().length >= 2}
        homeFeedPosts={homeFeedPosts}
        onSearchDropdownClose={() => setSearchDropdownOpen(false)}
        onSearchDropdownOpen={() => setSearchDropdownOpen(true)}
        onViewOwnProfile={() => {}}
        recentSearches={recentSearches}
        searchBlurTimeoutRef={searchBlurTimeoutRef}
        searchDropdownItems={searchDropdownItems}
        searchDropdownOpen={searchDropdownOpen}
        searchFilters={searchFilters}
        searchQuery={searchQuery}
        searchResults={searchResults}
        setHasSubmittedSearch={setHasSubmittedSearch}
        setSearchQuery={setSearchQuery}
        userEmail={userEmail}
        userHeadline={userHeadline}
        userName={userName}
      />
    )
  }

  return (
    <div className="page">
      <div className="halo" />
      <div className="grid-accent" />
      <div className="frame">
        <aside className="brand-panel">
          <div className="wordmark">
            <div className="mark">in</div>
            <span className="brand">LINKEDIN</span>
          </div>
          <h1>{heroHeadline}</h1>
          <p className="lede">The second version adds the main dashboard and search discovery layer.</p>
          <div className="highlight-list">
            {highlights.map((item) => (
              <div key={item} className="highlight">
                <span className="dot" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </aside>

        <main className="panel">
          <div className="panel-header">
            <div className="pill">
              <button type="button" className={mode === 'signin' ? 'active' : ''} onClick={() => switchMode('signin')}>
                Sign in
              </button>
              <button type="button" className={mode === 'signup' ? 'active' : ''} onClick={() => switchMode('signup')}>
                Sign up
              </button>
            </div>
          </div>

          <div className="panel-body">
            <div className="panel-title">{formTitle}</div>
            <form className="form" onSubmit={handleSubmit}>
              {mode === 'signup' && (
                <label className="field">
                  <span>Full name</span>
                  <input type="text" value={form.fullName} onChange={updateField('fullName')} />
                </label>
              )}

              <label className="field">
                <span>Email</span>
                <input type="email" value={form.email} onChange={updateField('email')} />
              </label>

              {mode === 'signup' && (
                <label className="field">
                  <span>Headline</span>
                  <input type="text" value={form.headline} onChange={updateField('headline')} />
                </label>
              )}

              <label className="field">
                <span>Password</span>
                <input type="password" value={form.password} onChange={updateField('password')} />
              </label>

              <button className="cta" type="submit" disabled={loading}>
                {loading ? 'Loading…' : ctaLabel}
              </button>
            </form>
            <div className={`status ${status.type}`}>{status.message || 'Try the discovery layer.'}</div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default App
