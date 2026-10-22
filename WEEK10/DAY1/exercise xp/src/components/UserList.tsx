import { useEffect, useState } from 'react'

interface User {
  id: number
  name: string
  username: string
  email: string
  company: {
    name: string
  }
}

type UserListStatus = 'loading' | 'success' | 'error'

export default function UserList() {
  const [users, setUsers] = useState<User[]>([])
  const [status, setStatus] = useState<UserListStatus>('loading')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    const controller = new AbortController()

    async function loadUsers() {
      setStatus('loading')
      setErrorMessage(null)

      try {
        const response = await fetch('https://jsonplaceholder.typicode.com/users', {
          signal: controller.signal,
        })

        if (!response.ok) {
          throw new Error(`The server responded with status ${response.status}.`)
        }

        const data: unknown = await response.json()
        if (!Array.isArray(data)) {
          throw new Error('The server returned an unexpected user list.')
        }

        setUsers(data as User[])
        setStatus('success')
      } catch (error) {
        if (controller.signal.aborted) return

        setErrorMessage(error instanceof Error ? error.message : 'An unexpected error occurred.')
        setStatus('error')
      }
    }

    void loadUsers()
    return () => controller.abort()
  }, [attempt])

  return (
    <section className="demo-card user-list-card" aria-labelledby="user-list-heading">
      <div className="card-topline">
        <span className="exercise-number">05</span>
        <span className={`status-chip status-${status}`}>
          <span aria-hidden="true" />
          {status === 'success' ? 'LIVE DATA' : status === 'loading' ? 'CONNECTING' : 'OFFLINE'}
        </span>
      </div>
      <div className="user-list-heading">
        <div>
          <p className="section-label">FETCHED WITH USEEFFECT</p>
          <h2 id="user-list-heading">A few familiar faces</h2>
        </div>
        {status === 'success' && <span className="user-count">{users.length} people</span>}
      </div>

      <div className="user-results" aria-live="polite" aria-busy={status === 'loading'}>
        {status === 'loading' && (
          <div className="fetch-state" role="status">
            <span className="spinner" aria-hidden="true" />
            <span>Loading the community…</span>
          </div>
        )}

        {status === 'error' && (
          <div className="fetch-error" role="alert">
            <span className="error-symbol" aria-hidden="true">!</span>
            <div>
              <strong>We couldn’t load the users.</strong>
              <p>{errorMessage}</p>
              <button className="retry-button" type="button" onClick={() => setAttempt((current) => current + 1)}>
                Try again
              </button>
            </div>
          </div>
        )}

        {status === 'success' && (
          <ul className="user-list">
            {users.map((user) => (
              <li className="api-user" key={user.id}>
                <span className="api-avatar" aria-hidden="true">{user.name.charAt(0)}</span>
                <div className="api-user-copy">
                  <strong>{user.name}</strong>
                  <span>@{user.username} <i>·</i> {user.company.name}</span>
                </div>
                <a href={`mailto:${user.email}`} aria-label={`Email ${user.name}`}>↗</a>
              </li>
            ))}
          </ul>
        )}
      </div>
      <p className="api-note">JSONPlaceholder API <span aria-hidden="true">·</span> data fetched on mount</p>
    </section>
  )
}
