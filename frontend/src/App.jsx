import { useMemo, useState } from 'react'
import './App.css'
import { highlights, starterForm } from './config/appConstants.js'

function App() {
  const [view, setView] = useState('auth')
  const [mode, setMode] = useState('signin')
  const [form, setForm] = useState(starterForm)
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState({ type: 'idle', message: 'Use the local starter flow.' })
  const [session, setSession] = useState({
    userName: '',
    userEmail: '',
    userHeadline: '',
  })

  const formTitle = mode === 'signin' ? 'Welcome back' : 'Create your account'
  const ctaLabel = mode === 'signin' ? 'Sign in' : 'Create account'
  const heroHeadline = useMemo(
    () =>
      mode === 'signin'
        ? 'A focused shell for the LINKEDIN experience.'
        : 'Start with the app foundation and grow the product from here.',
    [mode],
  )

  const updateField = (field) => (event) => {
    setForm((current) => ({ ...current, [field]: event.target.value }))
  }

  const switchMode = (nextMode) => {
    setMode(nextMode)
    setForm(starterForm)
    setStatus({ type: 'idle', message: 'Use the local starter flow.' })
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!form.email.trim() || !form.password.trim()) {
      setStatus({ type: 'error', message: 'Email and password are required.' })
      return
    }

    setLoading(true)
    setStatus({ type: 'pending', message: 'Booting the first project version...' })
    await new Promise((resolve) => window.setTimeout(resolve, 150))

    setSession({
      userName: form.fullName.trim() || 'Member One',
      userEmail: form.email.trim(),
      userHeadline: form.headline.trim() || 'Frontend App Shell Owner',
    })
    setView('dashboard')
    setStatus({ type: 'success', message: 'Version 1 is ready.' })
    setLoading(false)
  }

  if (view === 'dashboard') {
    return (
      <div className="page shell-page">
        <div className="shell-card">
          <div className="wordmark">
            <div className="mark">in</div>
            <span className="brand">LINKEDIN</span>
          </div>

          <div className="shell-header">
            <div>
              <h1>{session.userName || 'Member One'}</h1>
              <p>{session.userHeadline || 'Frontend App Shell Owner'}</p>
              <span>{session.userEmail}</span>
            </div>
            <button
              className="secondary-btn"
              onClick={() => {
                setView('auth')
                setForm(starterForm)
              }}
            >
              Logout
            </button>
          </div>

          <div className="shell-layout">
            <section className="shell-panel">
              <h2>Foundation</h2>
              <p>
                Version 1 establishes the app shell, the root state flow, and the main
                signed-in surface for future work.
              </p>
            </section>

            <section className="shell-panel">
              <h2>Quick links</h2>
              <ul>
                <li>Home feed</li>
                <li>Profile shell</li>
                <li>Search entry point</li>
              </ul>
            </section>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="page auth-page">
      <div className="frame">
        <aside className="brand-panel">
          <div className="wordmark">
            <div className="mark">in</div>
            <span className="brand">LINKEDIN</span>
          </div>
          <h1>{heroHeadline}</h1>
          <p className="lede">
            This first snapshot keeps the experience intentionally compact while the team
            establishes the app shell and session flow.
          </p>
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
          <div className="pill">
            <button type="button" className={mode === 'signin' ? 'active' : ''} onClick={() => switchMode('signin')}>
              Sign in
            </button>
            <button type="button" className={mode === 'signup' ? 'active' : ''} onClick={() => switchMode('signup')}>
              Sign up
            </button>
          </div>

          <div className="panel-title">{formTitle}</div>
          <p className="subtext">Keep the first version simple, stable, and easy to extend.</p>

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

          <div className={`status ${status.type}`}>{status.message}</div>
        </main>
      </div>
    </div>
  )
}

export default App
