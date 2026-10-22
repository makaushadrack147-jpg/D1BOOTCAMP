import Counter from './components/Counter'
import Greeting from './components/Greeting'
import UserCard from './components/UserCard'
import UserList from './components/UserList'

export default function App() {
  return (
    <main className="page-shell">
      <header className="topbar">
        <a className="brand" href="/" aria-label="Type and Tell home">
          <span className="brand-mark" aria-hidden="true">t.</span>
          <span>type<span className="brand-accent">and</span>tell</span>
        </a>
        <span className="topbar-note">A friendly first look at React + TypeScript</span>
      </header>

      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">WEEK 10 <i>/</i> DAY 01 <i>/</i> REACT + TYPESCRIPT</p>
          <h1>Give your UI<br /><span>a little type.</span></h1>
          <p className="hero-description">
            Five small exercises. Typed props, useful state, and a real API—one friendly step at a time.
          </p>
        </div>
        <div className="typescript-mark" aria-label="TypeScript">
          <span>TS</span>
          <i aria-hidden="true">✳</i>
        </div>
      </section>

      <div className="learning-grid">
        <section className="demo-card setup-card" aria-labelledby="setup-heading">
          <div className="card-topline">
            <span className="exercise-number">01</span>
            <span className="type-chip">READY TO BUILD</span>
          </div>
          <p className="section-label">VITE + REACT + TYPESCRIPT</p>
          <h2 id="setup-heading">A fresh start, already running.</h2>
          <p className="muted-copy">
            This project is powered by Vite with TypeScript’s strict checks enabled.
            Every component below is part of the same little learning playground.
          </p>
          <div className="setup-tags">
            <span>React</span><span>TypeScript</span><span>Vite</span>
          </div>
        </section>

        <Greeting name="Sam" messageCount={3} />
        <Counter />
        <UserCard />
        <UserCard name="Jordan Lee" age={34} role="Design lead" />
      </div>

      <UserList />

      <footer className="page-footer">
        <span>Types make the helpful parts clearer.</span>
        <span>BUILT WITH <i>♥</i> &amp; TYPES</span>
      </footer>
    </main>
  )
}
