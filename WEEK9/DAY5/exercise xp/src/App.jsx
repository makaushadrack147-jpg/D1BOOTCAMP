import BookList from './components/BookList.jsx'

export default function App() {
  return (
    <main className="page-shell">
      <header className="topbar">
        <a className="brand" href="/" aria-label="Between the Covers home">
          <span className="brand-mark" aria-hidden="true">b.</span>
          <span>between<span className="brand-accent">the</span>covers</span>
        </a>
        <span className="topbar-note">A quiet corner for curious readers</span>
      </header>

      <section className="intro">
        <p className="eyebrow">A PERSONAL BOOK INVENTORY</p>
        <h1>Find your next<br /><span>favorite story.</span></h1>
        <p className="intro-copy">
          Browse the shelf by genre and let a good story find its way to you.
        </p>
        <span className="intro-flower" aria-hidden="true">✳</span>
      </section>

      <BookList />

      <footer className="page-footer">
        <span>Made for the love of a good book.</span>
        <span>WEEK 09 <i>/</i> DAY 05</span>
      </footer>
    </main>
  )
}
