import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchUser } from './store/usersSlice.js'

function getInitials(name) {
  return name
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

export default function App() {
  const dispatch = useDispatch()
  const { user, status, error } = useSelector((state) => state.users)
  const [userId, setUserId] = useState('1')
  const isLoading = status === 'loading'

  useEffect(() => {
    dispatch(fetchUser(1))
  }, [dispatch])

  function handleSubmit(event) {
    event.preventDefault()
    const parsedId = Number(userId)

    if (!Number.isInteger(parsedId) || parsedId < 1) {
      return
    }

    dispatch(fetchUser(parsedId))
  }

  return (
    <main className="page-shell">
      <header className="topbar">
        <a className="brand" href="/" aria-label="User directory home">
          <span className="brand-mark" aria-hidden="true">u</span>
          <span>user<span className="brand-accent">book</span></span>
        </a>
        <span className="topbar-note">A small directory, powered by Redux.</span>
      </header>

      <section className="intro">
        <p className="eyebrow">REDUX TOOLKIT · ASYNC THUNK</p>
        <h1>People, at<br /><span>a glance.</span></h1>
        <p className="intro-copy">
          Enter a user ID to fetch a profile from JSONPlaceholder and keep the result in your store.
        </p>
      </section>

      <section className="directory-card" aria-labelledby="directory-heading">
        <div className="card-heading">
          <div>
            <p className="section-kicker">USER DIRECTORY</p>
            <h2 id="directory-heading">Find a profile</h2>
          </div>
          <span className="api-badge"><span aria-hidden="true" /> API CONNECTED</span>
        </div>

        <form className="search-form" onSubmit={handleSubmit}>
          <label htmlFor="user-id">User ID</label>
          <div className="search-controls">
            <input
              id="user-id"
              type="number"
              min="1"
              step="1"
              value={userId}
              onChange={(event) => setUserId(event.target.value)}
              placeholder="Try 1–10"
              required
              aria-describedby="search-hint"
            />
            <button type="submit" disabled={isLoading}>
              {isLoading ? 'Searching…' : 'Find user'}
              <span aria-hidden="true">→</span>
            </button>
          </div>
          <p className="field-hint" id="search-hint">
            Try an ID from 1 to 10, or enter 999 to see error handling.
          </p>
        </form>

        <div className="result-area" aria-live="polite" aria-busy={isLoading}>
          {isLoading && (
            <div className="state-panel" role="status">
              <span className="spinner" aria-hidden="true" />
              <div>
                <strong>Finding your person…</strong>
                <p>The thunk is fetching the user profile.</p>
              </div>
            </div>
          )}

          {status === 'failed' && (
            <div className="error-panel" role="alert">
              <span className="error-icon" aria-hidden="true">!</span>
              <div>
                <strong>We couldn’t load that profile</strong>
                <p>{error}</p>
                <button
                  className="retry-button"
                  type="button"
                  onClick={() => dispatch(fetchUser(Number(userId)))}
                >
                  Try again
                </button>
              </div>
            </div>
          )}

          {status === 'succeeded' && user && (
            <article className="user-profile" aria-labelledby="user-name">
              <div className="profile-banner">
                <div className="avatar" aria-hidden="true">{getInitials(user.name)}</div>
                <div className="profile-title">
                  <p className="profile-label">PROFILE · #{user.id}</p>
                  <h3 id="user-name">{user.name}</h3>
                  <p className="username">@{user.username}</p>
                </div>
                <span className="profile-check" aria-label="Profile loaded">✓</span>
              </div>

              <div className="profile-details">
                <div className="detail-item">
                  <span className="detail-icon" aria-hidden="true">@</span>
                  <div><span className="detail-label">EMAIL</span><a href={`mailto:${user.email}`}>{user.email}</a></div>
                </div>
                <div className="detail-item">
                  <span className="detail-icon" aria-hidden="true">↗</span>
                  <div><span className="detail-label">WEBSITE</span><a href={`https://${user.website}`} target="_blank" rel="noreferrer">{user.website}</a></div>
                </div>
                <div className="detail-item">
                  <span className="detail-icon" aria-hidden="true">⌖</span>
                  <div><span className="detail-label">LOCATION</span><span>{user.address.city}, {user.address.street}</span></div>
                </div>
                <div className="detail-item">
                  <span className="detail-icon" aria-hidden="true">▦</span>
                  <div><span className="detail-label">COMPANY</span><span>{user.company.name}</span></div>
                </div>
              </div>
            </article>
          )}
        </div>
      </section>

      <footer className="page-footer">
        <span>Built with React + Redux Toolkit</span>
        <span className="footer-status"><span aria-hidden="true" /> {isLoading ? 'FETCHING' : status.toUpperCase()}</span>
      </footer>
    </main>
  )
}
