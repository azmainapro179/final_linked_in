import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
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
import CompanyPage from './pages/CompanyPage.jsx'
import SchoolPage from './pages/SchoolPage.jsx'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000'
const SESSION_STORAGE_KEY = 'linkedin-demo-session'
const RECENT_SEARCHES_KEY = 'linkedin-demo-recent-searches'

function App() {
  const [view, setView] = useState('auth')
  const [mode, setMode] = useState('signin')
  const [form, setForm] = useState(starterForm)
  const [status, setStatus] = useState({ type: 'idle', message: '' })
  const [loading, setLoading] = useState(false)
  const [userId, setUserId] = useState(null)
  const [userEmail, setUserEmail] = useState('')
  const [userName, setUserName] = useState('')
  const [userHeadline, setUserHeadline] = useState('')
  // Notifications panel
  const [showNotifications, setShowNotifications] = useState(false)

  // Dashboard & Search states
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [searchLoading, setSearchLoading] = useState(false)
  const [hasSubmittedSearch, setHasSubmittedSearch] = useState(false)
  const [searchSuggestions, setSearchSuggestions] = useState([])
  const [searchDropdownOpen, setSearchDropdownOpen] = useState(false)
  const [recentSearches, setRecentSearches] = useState([])
  const [selectedUser, setSelectedUser] = useState(null)
  const [activeFilter, setActiveFilter] = useState('all')
  
  // Companies & Schools & Jobs states
  const [companyResults, setCompanyResults] = useState([])
  const [schoolResults, setSchoolResults] = useState([])
  const [jobResults, setJobResults] = useState([])
  const [selectedCompany, setSelectedCompany] = useState(null)
  const [selectedSchool, setSelectedSchool] = useState(null)

  const [workHistory, setWorkHistory] = useState([
    { company: '', title: '', start: '', end: '', current: false },
  ])
  const [education, setEducation] = useState([
    { school: '', degree: 'Bachelors', field: '' },
  ])
  const [skills, setSkills] = useState([])
  const [interests, setInterests] = useState([])
  const [pending, setPending] = useState([])
  const [connected, setConnected] = useState([])
  const [invited, setInvited] = useState([])
  const [followedCompanyIds, setFollowedCompanyIds] = useState([])
  // My Network UI state
  const [networkView, setNetworkView] = useState('pending') // 'pending' | 'invitations' | 'connections' | 'following'
  const [networkPendingUsers, setNetworkPendingUsers] = useState([])
  const [networkInvitedUsers, setNetworkInvitedUsers] = useState([])
  const [networkConnectedUsers, setNetworkConnectedUsers] = useState([])
  const [networkFollowedCompanies, setNetworkFollowedCompanies] = useState([])
  const [networkSuggestions, setNetworkSuggestions] = useState([])
  const [networkFollowSuggestions, setNetworkFollowSuggestions] = useState([])
  const [networkLoading, setNetworkLoading] = useState(false)
  const [skillInput, setSkillInput] = useState('')
  const [interestInput, setInterestInput] = useState('')
  const searchBlurTimeoutRef = useRef(null)
  const [profileStatus, setProfileStatus] = useState({
    type: 'idle',
    message: 'Complete your profile to stand out.',
  })

  const removeCurrentUserFromResults = useCallback(
    (users = []) => users.filter((user) => user?.id && user.id !== userId),
    [userId],
  )

  const saveRecentSearch = (value) => {
    const trimmed = value.trim()
    if (!trimmed) return
    setRecentSearches((current) => {
      const next = [trimmed, ...current.filter((item) => item.toLowerCase() !== trimmed.toLowerCase())].slice(0, 6)
      try {
        window.localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(next))
      } catch (error) {
        console.error('Recent search save error:', error)
      }
      return next
    })
  }

  const clearRecentSearches = () => {
    setRecentSearches([])
    try {
      window.localStorage.removeItem(RECENT_SEARCHES_KEY)
    } catch (error) {
      console.error('Recent search clear error:', error)
    }
  }

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(SESSION_STORAGE_KEY)
      if (!raw) return
      const session = JSON.parse(raw)
      if (!session?.userId || !session?.userEmail) return

      setUserId(session.userId)
      setUserEmail(session.userEmail)
      setUserName(session.userName || '')
      setUserHeadline(session.userHeadline || '')
      setPending(Array.isArray(session.pending) ? session.pending : [])
      setConnected(Array.isArray(session.connected) ? session.connected : [])
      setInvited(Array.isArray(session.invited) ? session.invited : [])
      setFollowedCompanyIds(Array.isArray(session.followedCompanyIds) ? session.followedCompanyIds : [])
      setWorkHistory(session.workHistory?.length ? session.workHistory : emptyProfile.workHistory)
      setEducation(session.education?.length ? session.education : emptyProfile.education)
      setSkills(Array.isArray(session.skills) ? session.skills : [])
      setInterests(Array.isArray(session.interests) ? session.interests : [])
      setView('dashboard')
      setActiveFilter('all')
      pushPath('/dashboard')
    } catch (error) {
      console.error('Session restore error:', error)
      window.localStorage.removeItem(SESSION_STORAGE_KEY)
    }
  }, [])

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(RECENT_SEARCHES_KEY)
      if (!raw) return
      const parsed = JSON.parse(raw)
      setRecentSearches(Array.isArray(parsed) ? parsed : [])
    } catch (error) {
      console.error('Recent search restore error:', error)
      window.localStorage.removeItem(RECENT_SEARCHES_KEY)
    }
  }, [])

  useEffect(() => {
    if (!userId || !userEmail) return
    try {
      window.localStorage.setItem(
        SESSION_STORAGE_KEY,
        JSON.stringify({
          userId,
          userEmail,
          userName,
          userHeadline,
          pending,
          connected,
          invited,
          followedCompanyIds,
          workHistory,
          education,
          skills,
          interests,
        }),
      )
    } catch (error) {
      console.error('Session save error:', error)
    }
  }, [
    userId,
    userEmail,
    userName,
    userHeadline,
    pending,
    connected,
    invited,
    followedCompanyIds,
    workHistory,
    education,
    skills,
    interests,
  ])

  const formTitle =
    view === 'auth'
      ? mode === 'signin'
        ? 'Welcome back'
        : 'Join LINKEDIN'
      : 'Profile Setup'
  const ctaLabel = mode === 'signin' ? 'Sign in' : 'Create account'

  const heroHeadline = useMemo(
    () => {
      if (view === 'profile') {
        return 'Ship your profile so recruiters find you first.'
      }
      return mode === 'signin'
        ? 'Pick up the conversation with recruiters and peers.'
        : 'Join a community built for career moves.'
    },
    [mode, view],
  )

  const updateField = (field) => (event) => {
    setForm((current) => ({ ...current, [field]: event.target.value }))
  }

  const switchMode = (next) => {
    setMode(next)
    setForm(starterForm)
    setStatus({ type: 'idle', message: '' })
  }

  const pushPath = (path) => {
    window.history.pushState({}, '', path)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)
    setStatus({ type: 'pending', message: 'Contacting LINKEDIN secure API...' })

    const endpoint = mode === 'signin' ? '/api/signin' : '/api/signup'
    const payload =
      mode === 'signin'
        ? {
            email: form.email.trim(),
            password: form.password,
          }
        : {
            fullName: form.fullName.trim(),
            email: form.email.trim(),
            password: form.password,
            headline: form.headline.trim(),
          }

    try {
      const response = await fetch(`${API_BASE}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await response.json().catch(() => ({}))

      if (!response.ok) {
        throw new Error(data?.message || 'Unable to process your request.')
      }

      if (mode === 'signup') {
        setStatus({
          type: 'success',
          message: data?.message || 'Account created. Redirecting to sign in...',
        })
        setMode('signin')
        setForm({ ...starterForm, email: form.email })
        pushPath('/')
        return
      }

      setUserId(data?.profile?.id || null)
      setUserEmail(data?.profile?.email || form.email)
      setUserName(data?.profile?.fullName || '')
      setUserHeadline(data?.profile?.headline || '')
      setStatus({
        type: 'success',
        message: data?.message || 'You are in. Redirecting...',
      })
      const profileData = data?.profileData || {}
      setWorkHistory(
        profileData.workHistory?.length
          ? profileData.workHistory
          : emptyProfile.workHistory,
      )
      setEducation(
        profileData.education?.length
          ? profileData.education
          : emptyProfile.education,
      )
      setSkills(profileData.skills || emptyProfile.skills)
      setInterests(profileData.interests || emptyProfile.interests)
      setPending(data?.pending || [])
      setConnected(data?.connected || [])
      setInvited(data?.invited || [])
      setFollowedCompanyIds(data?.followedCompanyIds || [])
      setView('dashboard')
      setActiveFilter('all')
      setProfileStatus({
        type: 'idle',
        message: 'Complete your profile to stand out.',
      })
      pushPath('/dashboard')
    } catch (error) {
      setStatus({
        type: 'error',
        message: error.message || 'Something went wrong. Try again.',
      })
    } finally {
      setLoading(false)
    }
  }

  const disabled =
    loading ||
    (mode === 'signin'
      ? !form.email.trim() || !form.password
      : !form.fullName.trim() || !form.email.trim() || !form.password)

  const updateWorkItem = (index, key, value) => {
    setWorkHistory((current) =>
      current.map((item, idx) => {
        if (idx !== index) return item
        if (key === 'current' && value) {
          return { ...item, current: value, end: '' }
        }
        return { ...item, [key]: value }
      }),
    )
  }

  const addWorkRow = () => {
    setWorkHistory((current) => [
      ...current,
      { company: '', title: '', start: '', end: '', current: false },
    ])
  }

  const removeWorkRow = (index) => {
    setWorkHistory((current) =>
      current.filter((_, idx) => idx !== index).length
        ? current.filter((_, idx) => idx !== index)
        : [{ company: '', title: '', start: '', end: '', current: false }],
    )
  }

  const updateEduItem = (index, key, value) => {
    setEducation((current) =>
      current.map((item, idx) => (idx === index ? { ...item, [key]: value } : item)),
    )
  }

  const addEduRow = () => {
    setEducation((current) => [...current, { school: '', degree: 'Bachelors', field: '' }])
  }

  const removeEduRow = (index) => {
    setEducation((current) =>
      current.filter((_, idx) => idx !== index).length
        ? current.filter((_, idx) => idx !== index)
        : [{ school: '', degree: 'Bachelors', field: '' }],
    )
  }

  const addTag = (value, list, setList, setInput) => {
    const trimmed = value.trim()
    if (!trimmed) return
    if (list.includes(trimmed)) {
      setInput('')
      return
    }
    setList([...list, trimmed])
    setInput('')
  }

  const mergeTagInput = (list, value) => {
    const trimmed = value.trim()
    if (!trimmed) return list
    return list.includes(trimmed) ? list : [...list, trimmed]
  }

  const removeTag = (value, setList) => {
    setList((current) => current.filter((item) => item !== value))
  }

  const handleProfileSubmit = async (event) => {
    event.preventDefault()
    if (!userEmail) {
      setProfileStatus({
        type: 'error',
        message: 'Missing signed-in user. Please sign in again.',
      })
      setView('auth')
      setMode('signin')
      pushPath('/')
      return
    }
    setProfileStatus({ type: 'pending', message: 'Saving your profile...' })

    const cleanedSkills = mergeTagInput(skills, skillInput)
    const cleanedInterests = mergeTagInput(interests, interestInput)

    setSkills(cleanedSkills)
    setInterests(cleanedInterests)
    setSkillInput('')
    setInterestInput('')

    const payload = {
      email: userEmail,
      workHistory,
      education,
      skills: cleanedSkills,
      interests: cleanedInterests,
    }

    try {
      const response = await fetch(`${API_BASE}/api/update-profile`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await response.json().catch(() => ({}))
      if (!response.ok) {
        throw new Error(data?.message || 'Unable to save profile.')
      }
      setProfileStatus({
        type: 'success',
        message: data?.message || 'Profile saved. Redirecting to home...',
      })
      // Go to home feed after 1 second
      setTimeout(() => {
        setView('dashboard')
        setActiveFilter('all')
        pushPath('/dashboard')
      }, 1000)
    } catch (error) {
      setProfileStatus({
        type: 'error',
        message: error.message || 'Unable to save profile.',
      })
    }
  }

  // Search Function - searches ALL or specific filter
  const handleSearch = async (e, filterOverride = null) => {
    e?.preventDefault()
    if (!searchQuery.trim() || searchQuery.length < 2) {
      setHasSubmittedSearch(false)
      setSearchResults([])
      setCompanyResults([])
      setSchoolResults([])
      setJobResults([])
      return
    }

    setSearchLoading(true)
    const query = encodeURIComponent(searchQuery.trim())
    const currentFilter = filterOverride || activeFilter
    saveRecentSearch(searchQuery)
    
    try {
      if (currentFilter === 'all') {
        // Search all - people, companies, schools, jobs
        const [peopleRes, companiesRes, schoolsRes, jobsRes] = await Promise.all([
          fetch(`${API_BASE}/api/search?q=${query}`),
          fetch(`${API_BASE}/api/companies?q=${query}`),
          fetch(`${API_BASE}/api/schools?q=${query}`),
          fetch(`${API_BASE}/api/jobs?q=${query}`)
        ])
        
        const [peopleData, companiesData, schoolsData, jobsData] = await Promise.all([
          peopleRes.json(),
          companiesRes.json(),
          schoolsRes.json(),
          jobsRes.json()
        ])
        
        setSearchResults(removeCurrentUserFromResults(peopleData.users || []))
        setCompanyResults(companiesData.companies || [])
        setSchoolResults(schoolsData.schools || [])
        setJobResults(jobsData.jobs || [])
      } else if (currentFilter === 'people') {
        const response = await fetch(`${API_BASE}/api/search?q=${query}`)
        const data = await response.json()
        setSearchResults(removeCurrentUserFromResults(data.users || []))
        setCompanyResults([])
        setSchoolResults([])
        setJobResults([])
      } else if (currentFilter === 'companies') {
        const response = await fetch(`${API_BASE}/api/companies?q=${query}`)
        const data = await response.json()
        setCompanyResults(data.companies || [])
        setSearchResults([])
        setSchoolResults([])
        setJobResults([])
      } else if (currentFilter === 'schools') {
        const response = await fetch(`${API_BASE}/api/schools?q=${query}`)
        const data = await response.json()
        setSchoolResults(data.schools || [])
        setSearchResults([])
        setCompanyResults([])
        setJobResults([])
      } else if (currentFilter === 'jobs') {
        const response = await fetch(`${API_BASE}/api/jobs?q=${query}`)
        const data = await response.json()
        setJobResults(data.jobs || [])
        setSearchResults([])
        setCompanyResults([])
        setSchoolResults([])
      }
    } catch (error) {
      console.error('Search error:', error)
      setSearchResults([])
      setCompanyResults([])
      setSchoolResults([])
      setJobResults([])
    } finally {
      setSearchLoading(false)
    }
  }

  const handleTopSearchSubmit = (event) => {
    event?.preventDefault()
    setSearchDropdownOpen(false)
    setHasSubmittedSearch(searchQuery.trim().length >= 2)
    setActiveFilter('all')
    handleSearch(event, 'all')
  }

  useEffect(() => {
    if (!searchDropdownOpen) return
    if (searchQuery.trim().length < 2) {
      setSearchSuggestions([])
      return
    }

    let cancelled = false
    const timer = window.setTimeout(async () => {
      const query = encodeURIComponent(searchQuery.trim())
      try {
        const [peopleRes, companiesRes, schoolsRes, jobsRes] = await Promise.all([
          fetch(`${API_BASE}/api/search?q=${query}`),
          fetch(`${API_BASE}/api/companies?q=${query}`),
          fetch(`${API_BASE}/api/schools?q=${query}`),
          fetch(`${API_BASE}/api/jobs?q=${query}`),
        ])

        const [peopleData, companiesData, schoolsData, jobsData] = await Promise.all([
          peopleRes.json().catch(() => ({})),
          companiesRes.json().catch(() => ({})),
          schoolsRes.json().catch(() => ({})),
          jobsRes.json().catch(() => ({})),
        ])

        if (cancelled) return

        const peopleSuggestions = removeCurrentUserFromResults(peopleData.users || []).slice(0, 3).map((user) => ({
          id: `person-${user.id}`,
          entityId: user.id,
          type: 'person',
          title: user.fullName,
          subtitle: user.headline || user.email,
        }))

        const companySuggestions = (companiesData.companies || []).slice(0, 2).map((company) => ({
          id: `company-${company.id}`,
          entityId: company.id,
          type: 'company',
          title: company.name,
          subtitle: `${company.industry || 'Company'}${company.location ? ` · ${company.location}` : ''}`,
        }))

        const schoolSuggestions = (schoolsData.schools || []).slice(0, 2).map((school) => ({
          id: `school-${school.id}`,
          entityId: school.id,
          type: 'school',
          title: school.name,
          subtitle: `${school.type || 'School'}${school.location ? ` · ${school.location}` : ''}`,
        }))

        const jobSuggestions = (jobsData.jobs || []).slice(0, 2).map((job, index) => ({
          id: `job-${job.userId}-${index}`,
          entityId: job.userId,
          type: 'job',
          title: job.title,
          subtitle: `${job.company || 'Job'}${job.userName ? ` · ${job.userName}` : ''}`,
        }))

        setSearchSuggestions([
          ...peopleSuggestions,
          ...companySuggestions,
          ...schoolSuggestions,
          ...jobSuggestions,
        ].slice(0, 8))
      } catch (error) {
        if (!cancelled) {
          console.error('Search suggestions error:', error)
          setSearchSuggestions([])
        }
      }
    }, 180)

    return () => {
      cancelled = true
      window.clearTimeout(timer)
    }
  }, [removeCurrentUserFromResults, searchQuery, searchDropdownOpen, userId])

  const handleSuggestionSelect = async (suggestion) => {
    setSearchDropdownOpen(false)
    if (!suggestion) return

    setSearchQuery(suggestion.title)
    if (suggestion.type === 'recent') {
      saveRecentSearch(suggestion.title)
    }
  }

  const searchDropdownItems =
    searchQuery.trim().length >= 2
      ? searchSuggestions
      : recentSearches.map((item, index) => ({
          id: `recent-${index}-${item}`,
          type: 'recent',
          title: item,
          subtitle: 'Recent search',
        }))

  // View User Profile
  const handleViewProfile = async (userId) => {
    if (!userId) return
    try {
      const response = await fetch(`${API_BASE}/api/user/${userId}`)
      const data = await response.json()
      if (data.user) {
        setSelectedUser(data.user)
        setView('viewProfile')
        pushPath(`/user/${userId}`)
      }
    } catch (error) {
      console.error('View profile error:', error)
    }
  }

  // Load user objects for pending & connected IDs when My Network is active
  const loadNetworkUsers = useCallback(async () => {
    if (activeFilter !== 'myNetwork') return
    setNetworkLoading(true)
    try {
      const fetchUser = async (id) => {
        if (!id) return null
        const r = await fetch(`${API_BASE}/api/user/${id}`)
        const d = await r.json().catch(() => ({}))
        return d.user || null
      }
      const [
        pendingUsers,
        invitedUsers,
        connectedUsers,
        followedCompaniesResponse,
        suggestionsResponse,
        followSuggestionsResponse,
      ] = await Promise.all([
        Promise.all(pending.map((id) => fetchUser(id))),
        Promise.all(invited.map((id) => fetchUser(id))),
        Promise.all(connected.map((id) => fetchUser(id))),
        userId
          ? fetch(`${API_BASE}/api/followed-companies?userId=${encodeURIComponent(userId)}`)
          : Promise.resolve(null),
        userId
          ? fetch(`${API_BASE}/api/network-suggestions?userId=${encodeURIComponent(userId)}`)
          : Promise.resolve(null),
        userId
          ? fetch(`${API_BASE}/api/company-follow-suggestions?userId=${encodeURIComponent(userId)}`)
          : Promise.resolve(null),
      ])
      const followedCompaniesData = followedCompaniesResponse
        ? await followedCompaniesResponse.json().catch(() => ({}))
        : {}
      const suggestionsData = suggestionsResponse
        ? await suggestionsResponse.json().catch(() => ({}))
        : {}
      const followSuggestionsData = followSuggestionsResponse
        ? await followSuggestionsResponse.json().catch(() => ({}))
        : {}
      setNetworkPendingUsers(pendingUsers.filter(Boolean))
      setNetworkInvitedUsers(invitedUsers.filter(Boolean))
      setNetworkConnectedUsers(connectedUsers.filter(Boolean))
      setNetworkFollowedCompanies(Array.isArray(followedCompaniesData.companies) ? followedCompaniesData.companies : [])
      setNetworkSuggestions(Array.isArray(suggestionsData.suggestions) ? suggestionsData.suggestions : [])
      setNetworkFollowSuggestions(Array.isArray(followSuggestionsData.companies) ? followSuggestionsData.companies : [])
    } catch (err) {
      console.error('Load network users error:', err)
      setNetworkPendingUsers([])
      setNetworkInvitedUsers([])
      setNetworkConnectedUsers([])
      setNetworkFollowedCompanies([])
      setNetworkSuggestions([])
      setNetworkFollowSuggestions([])
    } finally {
      setNetworkLoading(false)
    }
  }, [activeFilter, connected, invited, pending, userId])

  // Refresh network lists when we navigate to My Network or when ids change
  useEffect(() => {
    if (activeFilter === 'myNetwork') {
      loadNetworkUsers()
    }
  }, [activeFilter, connected, followedCompanyIds, invited, loadNetworkUsers, pending, userId])

  const handleAcceptInvite = async (userId, inviterId) => {
    if (!userId) return
    try {
      const response = await fetch(`${API_BASE}/api/accept-invite`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: userId, inviterId: inviterId }),
      })

      if (response.ok) {
        // Refresh the user list or update the connection status
        setConnected((current) => [...current, inviterId])
        setInvited((current) => current.filter((id) => id !== inviterId))
      }
    } catch (error) {
      console.error('Accept invite error:', error)
    }
  }

  const handleRejectInvite = async (userId, inviterId) => {
    if (!userId) return
    try {
      const response = await fetch(`${API_BASE}/api/reject-invite`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: userId, inviterId: inviterId }),
      })
      if (response.ok) {
        // Refresh the user list or update the connection status
        setInvited((current) => current.filter((id) => id !== inviterId))
      }
    } catch (error) {
      console.error('Reject invite error:', error)
    }
  }

  const handleCancelInvite = async (userId, inviteeId) => {
    if (!userId) return
    try {
      const response = await fetch(`${API_BASE}/api/cancel-invite`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: userId, inviteeId: inviteeId }),
      })
      if (response.ok) {
        // Refresh the user list or update the connection status
        setPending((current) => current.filter((id) => id !== inviteeId))
      }
    } catch (error) {
      console.error('Reject invite error:', error)
    }
  }

  const handleConnect = async (userId, inviteeId) => {
    if (!userId) return
    try {
      const response = await fetch(`${API_BASE}/api/send-invite`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: userId, inviteeId: inviteeId }),
      })
      if (response.ok) {
        // Refresh the user list or update the connection status
        setPending((current) => [...current, inviteeId])
      }
    } catch (error) {
      console.error('Connect error:', error)
    }
  }

  const handleRemoveConnection = async (userId, connectionId) => {
    if (!userId) return
    try {
      const response = await fetch(`${API_BASE}/api/remove-connection`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: userId, connectionId: connectionId }),
      })
      if (response.ok) {
        // Refresh the user list or update the connection status
        setConnected((current) => current.filter((id) => id != connectionId))
      }
    } catch (error) {
      console.error('Connect error:', error)
    }
  }

  const handleFollowCompany = async (companyId) => {
    if (!userId || !companyId) return
    try {
      const response = await fetch(`${API_BASE}/api/follow-company`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, companyId }),
      })
      if (response.ok) {
        setFollowedCompanyIds((current) =>
          current.includes(companyId) ? current : [...current, companyId],
        )
        setSelectedCompany((current) =>
          current?.id === companyId
            ? { ...current, followers: Number(current.followers || 0) + 1 }
            : current,
        )
      }
    } catch (error) {
      console.error('Follow company error:', error)
    }
  }

  const handleUnfollowCompany = async (companyId) => {
    if (!userId || !companyId) return
    try {
      const response = await fetch(`${API_BASE}/api/unfollow-company`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, companyId }),
      })
      if (response.ok) {
        setFollowedCompanyIds((current) => current.filter((id) => id !== companyId))
        setSelectedCompany((current) =>
          current?.id === companyId
            ? { ...current, followers: Math.max(Number(current.followers || 0) - 1, 0) }
            : current,
        )
      }
    } catch (error) {
      console.error('Unfollow company error:', error)
    }
  }

  // Go to Dashboard
  const goToDashboard = () => {
    setView('dashboard')
    setSelectedUser(null)
    setSelectedCompany(null)
    setSelectedSchool(null)
    setSearchQuery('')
    setHasSubmittedSearch(false)
    setSearchResults([])
    setCompanyResults([])
    setSchoolResults([])
    setJobResults([])
    setActiveFilter('all')
    pushPath('/dashboard')
  }

  // Go back to search - preserves search results
  const goBackToSearch = () => {
    setView('dashboard')
    setSelectedUser(null)
    setSelectedCompany(null)
    setSelectedSchool(null)
    pushPath('/dashboard')
  }

  // Handle filter change - auto search with new filter
  const handleFilterChange = (filterId) => {
    setActiveFilter(filterId)
    
    // Auto-trigger search if there's a query
    if (searchQuery.trim().length >= 2) {
      handleSearch(null, filterId)
    }
  }

  // View Company
  const handleViewCompany = async (companyId) => {
    if (!companyId) return
    try {
      const response = await fetch(`${API_BASE}/api/company/${companyId}`)
      const data = await response.json()
      if (data.company) {
        setSelectedCompany(data.company)
        setView('viewCompany')
        pushPath(`/company/${companyId}`)
      }
    } catch (error) {
      console.error('View company error:', error)
    }
  }

  // View School
  const handleViewSchool = async (schoolId) => {
    if (!schoolId) return
    try {
      const response = await fetch(`${API_BASE}/api/school/${schoolId}`)
      const data = await response.json()
      if (data.school) {
        setSelectedSchool(data.school)
        setView('viewSchool')
        pushPath(`/school/${schoolId}`)
      }
    } catch (error) {
      console.error('View school error:', error)
    }
  }

  // Logout
  const handleLogout = () => {
    window.localStorage.removeItem(SESSION_STORAGE_KEY)
    setView('auth')
    setMode('signin')
    setUserEmail('')
    setUserName('')
    setUserHeadline('')
    setUserId(null)
    setFollowedCompanyIds([])
    setForm(starterForm)
    setHasSubmittedSearch(false)
    setActiveFilter('all')
    setShowNotifications(false)
    pushPath('/')
  }

  const hasSearchInput = searchQuery.trim().length >= 2

  // Dashboard View
  if (view === 'dashboard') {
    return (
      <DashboardPage
        activeFilter={activeFilter}
        clearRecentSearches={clearRecentSearches}
        companyResults={companyResults}
        connected={connected}
        feedSuggestions={feedSuggestions}
        followedCompanyIds={followedCompanyIds}
        goToDashboard={goToDashboard}
        handleAcceptInvite={handleAcceptInvite}
        handleCancelInvite={handleCancelInvite}
        handleConnect={handleConnect}
        handleFilterChange={handleFilterChange}
        handleFollowCompany={handleFollowCompany}
        handleLogout={handleLogout}
        handleRejectInvite={handleRejectInvite}
        handleRemoveConnection={handleRemoveConnection}
        handleSuggestionSelect={handleSuggestionSelect}
        handleTopSearchSubmit={handleTopSearchSubmit}
        handleUnfollowCompany={handleUnfollowCompany}
        handleViewCompany={handleViewCompany}
        handleViewProfile={handleViewProfile}
        handleViewSchool={handleViewSchool}
        hasSearchInput={hasSearchInput}
        hasSubmittedSearch={hasSubmittedSearch}
        homeFeedPosts={homeFeedPosts}
        invited={invited}
        jobResults={jobResults}
        networkConnectedUsers={networkConnectedUsers}
        networkFollowedCompanies={networkFollowedCompanies}
        networkFollowSuggestions={networkFollowSuggestions}
        networkInvitedUsers={networkInvitedUsers}
        networkLoading={networkLoading}
        networkPendingUsers={networkPendingUsers}
        networkSuggestions={networkSuggestions}
        networkView={networkView}
        onSearchDropdownClose={() => setSearchDropdownOpen(false)}
        onSearchDropdownOpen={() => setSearchDropdownOpen(true)}
        pending={pending}
        recentSearches={recentSearches}
        schoolResults={schoolResults}
        searchDropdownItems={searchDropdownItems}
        searchDropdownOpen={searchDropdownOpen}
        searchBlurTimeoutRef={searchBlurTimeoutRef}
        searchFilters={searchFilters}
        searchLoading={searchLoading}
        searchQuery={searchQuery}
        searchResults={searchResults}
        setHasSubmittedSearch={setHasSubmittedSearch}
        setNetworkView={setNetworkView}
        setSearchQuery={setSearchQuery}
        setShowNotifications={setShowNotifications}
        showNotifications={showNotifications}
        userEmail={userEmail}
        userHeadline={userHeadline}
        userId={userId}
        userName={userName}
      />
    )
  }

  // View Profile Page
  if (view === 'viewProfile' && selectedUser) {
    return (
      <UserProfilePage
        selectedUser={selectedUser}
        userId={userId}
        userName={userName}
        connected={connected}
        pending={pending}
        invited={invited}
        onGoToDashboard={goToDashboard}
        onGoBackToSearch={goBackToSearch}
        onLogout={handleLogout}
        onRemoveConnection={handleRemoveConnection}
        onCancelInvite={handleCancelInvite}
        onAcceptInvite={handleAcceptInvite}
        onRejectInvite={handleRejectInvite}
        onConnect={handleConnect}
      />
    )
  }

  // View Company Page
  if (view === 'viewCompany' && selectedCompany) {
    return (
      <CompanyPage
        selectedCompany={selectedCompany}
        userName={userName}
        followedCompanyIds={followedCompanyIds}
        onGoToDashboard={goToDashboard}
        onGoBackToSearch={goBackToSearch}
        onLogout={handleLogout}
        onFollowCompany={handleFollowCompany}
        onUnfollowCompany={handleUnfollowCompany}
      />
    )
  }

  // View School Page
  if (view === 'viewSchool' && selectedSchool) {
    return (
      <SchoolPage
        selectedSchool={selectedSchool}
        userName={userName}
        onGoToDashboard={goToDashboard}
        onGoBackToSearch={goBackToSearch}
        onLogout={handleLogout}
      />
    )
  }

  return (
    <AuthPage
      view={view}
      mode={mode}
      formTitle={formTitle}
      ctaLabel={ctaLabel}
      heroHeadline={heroHeadline}
      highlights={highlights}
      API_BASE={API_BASE}
      form={form}
      updateField={updateField}
      handleSubmit={handleSubmit}
      switchMode={switchMode}
      loading={loading}
      disabled={disabled}
      status={status}
      profileStatus={profileStatus}
      handleProfileSubmit={handleProfileSubmit}
      workHistory={workHistory}
      updateWorkItem={updateWorkItem}
      addWorkRow={addWorkRow}
      removeWorkRow={removeWorkRow}
      education={education}
      addEduRow={addEduRow}
      updateEduItem={updateEduItem}
      removeEduRow={removeEduRow}
      skills={skills}
      setSkills={setSkills}
      removeTag={removeTag}
      skillInput={skillInput}
      setSkillInput={setSkillInput}
      addTag={addTag}
      interests={interests}
      setInterests={setInterests}
      interestInput={interestInput}
      setInterestInput={setInterestInput}
    />
  )
}

export default App
