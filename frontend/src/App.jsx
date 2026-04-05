import { useMemo, useRef, useState } from 'react'
import './App.css'
import {
  emptyProfile,
  feedSuggestions,
  highlights,
  homeFeedPosts,
  searchFilters,
  starterForm,
} from './config/appConstants.js'
import AuthPage from './pages/AuthPage.jsx'
import DashboardPage from './pages/DashboardPage.jsx'
import UserProfilePage from './pages/UserProfilePage.jsx'

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
  const [selectedUser, setSelectedUser] = useState(null)
  const [activeFilter, setActiveFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [searchDropdownOpen, setSearchDropdownOpen] = useState(false)
  const [recentSearches, setRecentSearches] = useState(['Amina Rahman', 'BUET'])
  const [hasSubmittedSearch, setHasSubmittedSearch] = useState(false)
  const searchBlurTimeoutRef = useRef(null)

  const formTitle = view === 'auth' ? (mode === 'signin' ? 'Welcome back' : 'Create account') : 'Profile Setup'
  const ctaLabel = mode === 'signin' ? 'Sign in' : 'Create account'
  const heroHeadline = useMemo(
    () => 'Version 3 introduces reusable auth, profile, and navigation pages.',
    [],
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

  const selectedProfile =
    selectedUser ||
    {
      id: 'self',
      fullName: userName,
      email: userEmail,
      headline: userHeadline,
      profile: {
        workHistory: [
          { company: 'LINKEDIN', title: 'Frontend App Shell Owner', start: '2025-01', end: '', current: true },
        ],
        education: emptyProfile.education,
        skills: ['React', 'UI State', 'Navigation'],
        interests: ['Product Design', 'Search UX'],
      },
    }

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
    setStatus({ type: 'pending', message: 'Activating version 3…' })
    await new Promise((resolve) => window.setTimeout(resolve, 150))
    setUserName(form.fullName.trim() || 'Member Three')
    setUserEmail(form.email.trim())
    setUserHeadline(form.headline.trim() || 'Profile and Onboarding Experience')
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

  if (view === 'viewProfile') {
    return (
      <UserProfilePage
        selectedUser={selectedProfile}
        userId="self"
        userName={userName}
        connected={[]}
        pending={[]}
        invited={[]}
        onGoToDashboard={() => setView('dashboard')}
        onGoBackToSearch={() => setView('dashboard')}
        onLogout={() => setView('auth')}
        onRemoveConnection={() => {}}
        onCancelInvite={() => {}}
        onAcceptInvite={() => {}}
        onRejectInvite={() => {}}
        onConnect={() => {}}
      />
    )
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
        handleFilterChange={setActiveFilter}
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
        onViewOwnProfile={() => setView('viewProfile')}
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
    <AuthPage
      view="auth"
      mode={mode}
      formTitle={formTitle}
      ctaLabel={ctaLabel}
      heroHeadline={heroHeadline}
      highlights={highlights}
      API_BASE="Local incremental demo"
      form={form}
      updateField={updateField}
      handleSubmit={handleSubmit}
      switchMode={switchMode}
      loading={loading}
      disabled={loading}
      status={status}
      profileStatus={{ type: 'idle', message: 'Profile setup arrives in the next version.' }}
      handleProfileSubmit={(event) => event.preventDefault()}
      workHistory={emptyProfile.workHistory}
      updateWorkItem={() => {}}
      addWorkRow={() => {}}
      removeWorkRow={() => {}}
      education={emptyProfile.education}
      addEduRow={() => {}}
      updateEduItem={() => {}}
      removeEduRow={() => {}}
      skills={[]}
      setSkills={() => {}}
      removeTag={() => {}}
      skillInput=""
      setSkillInput={() => {}}
      addTag={() => {}}
      interests={[]}
      setInterests={() => {}}
      interestInput=""
      setInterestInput={() => {}}
    />
  )
}

export default App
