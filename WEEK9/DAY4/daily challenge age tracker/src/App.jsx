import { useDispatch, useSelector } from 'react-redux'
import AgeControls from './components/AgeControls.jsx'
import AgeDisplay from './components/AgeDisplay.jsx'
import { ageDownAsync, ageUpAsync } from './store/ageSlice.js'

export default function App() {
  const dispatch = useDispatch()
  const { age, loading } = useSelector((state) => state.age)

  return (
    <main className="page-shell">
      <header className="topbar">
        <a className="brand" href="/" aria-label="Age Tracker home">
          <span className="brand-mark" aria-hidden="true">A</span>
          <span>age<span className="brand-accent">tracker</span></span>
        </a>
        <span className="topbar-note">A little perspective, one year at a time.</span>
      </header>

      <section className="intro">
        <p className="eyebrow">REDUX TOOLKIT · ASYNC THUNK</p>
        <h1>Your story,<br /><span>still unfolding.</span></h1>
        <p className="intro-copy">
          Keep track of the years and see how a little asynchronous magic works.
        </p>
      </section>

      <section className="tracker-card" aria-label="Age tracker">
        <div className="card-decoration decoration-one" aria-hidden="true" />
        <div className="card-decoration decoration-two" aria-hidden="true" />
        <div className="card-content">
          <div className="card-kicker">
            <span className="sparkle" aria-hidden="true">✳</span>
            <span>YOUR PERSONAL TIMELINE</span>
          </div>
          <AgeDisplay age={age} loading={loading} />
          <AgeControls
            age={age}
            loading={loading}
            onAgeUp={() => dispatch(ageUpAsync())}
            onAgeDown={() => dispatch(ageDownAsync())}
          />
        </div>
      </section>

      <footer className="page-footer">
        <span>Built with React + Redux Toolkit</span>
        <span className="footer-status">
          <span className={loading ? 'status-dot is-busy' : 'status-dot'} aria-hidden="true" />
          {loading ? 'UPDATING' : 'ALL CAUGHT UP'}
        </span>
      </footer>
    </main>
  )
}
