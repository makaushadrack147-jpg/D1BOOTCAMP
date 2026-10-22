import { useCallback, useState, type FormEvent } from 'react'
import List from './components/List'
import type { Book } from './types'

const initialBooks: Book[] = [
  { id: 1, title: 'The Midnight Library', author: 'Matt Haig', color: 'blue' },
  { id: 2, title: 'Braiding Sweetgrass', author: 'Robin Wall Kimmerer', color: 'sage' },
  { id: 3, title: 'A Psalm for the Wild-Built', author: 'Becky Chambers', color: 'ochre' },
  { id: 4, title: 'The Secret History', author: 'Donna Tartt', color: 'plum' },
]

const coverColors: Book['color'][] = ['sage', 'plum', 'ochre', 'blue', 'rose', 'olive']

export default function BookApp() {
  const [books, setBooks] = useState<Book[]>(initialBooks)
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')

  const addBook = useCallback((event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const bookTitle = title.trim()
    const bookAuthor = author.trim()
    if (!bookTitle || !bookAuthor) return

    setBooks((currentBooks) => {
      const nextId = currentBooks.reduce((largestId, book) => Math.max(largestId, book.id), 0) + 1
      return [
        {
          id: nextId,
          title: bookTitle,
          author: bookAuthor,
          color: coverColors[currentBooks.length % coverColors.length],
        },
        ...currentBooks,
      ]
    })
    setTitle('')
    setAuthor('')
  }, [author, title])

  const renderBook = useCallback((book: Book, index: number) => (
    <article className="book-card">
      <div className={`book-cover cover-${book.color}`} aria-hidden="true">
        <span className="cover-ornament">✳</span>
        <span className="cover-index">{String(index + 1).padStart(2, '0')}</span>
      </div>
      <div className="book-copy">
        <span className="book-label">ON THE SHELF</span>
        <h3>{book.title}</h3>
        <p>by {book.author}</p>
      </div>
      <span className="book-mark" aria-hidden="true">↗</span>
    </article>
  ), [])

  return (
    <main className="page-shell">
      <header className="topbar">
        <a className="brand" href="/" aria-label="Good Reads home">
          <span className="brand-mark" aria-hidden="true">g.</span>
          <span>good<span>reads</span></span>
        </a>
        <span className="topbar-note">A little shelf of lovely things</span>
      </header>

      <section className="hero">
        <div>
          <p className="eyebrow">A READER’S LITTLE CORNER</p>
          <h1>Stories worth<br /><span>keeping close.</span></h1>
          <p className="hero-copy">
            A growing list, one book at a time. Add a favorite and give it a place on the shelf.
          </p>
        </div>
        <div className="hero-stamp" aria-label={`${books.length} books on the shelf`}>
          <span className="stamp-star" aria-hidden="true">✳</span>
          <strong>{String(books.length).padStart(2, '0')}</strong>
          <span>BOOKS<br />ON SHELF</span>
        </div>
      </section>

      <section className="library-layout" aria-label="Book library">
        <aside className="add-panel">
          <p className="section-label">MAKE IT YOURS</p>
          <h2>Add a book</h2>
          <p className="form-intro">What have you been reading lately?</p>

          <form className="book-form" onSubmit={addBook}>
            <label htmlFor="book-title">Book title</label>
            <input
              id="book-title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="e.g. The Paper Palace"
              maxLength={100}
              required
            />
            <label htmlFor="book-author">Author</label>
            <input
              id="book-author"
              value={author}
              onChange={(event) => setAuthor(event.target.value)}
              placeholder="e.g. Miranda Cowley Heller"
              maxLength={80}
              required
            />
            <button type="submit" disabled={!title.trim() || !author.trim()}>
              <span aria-hidden="true">+</span> Add to shelf
            </button>
          </form>

          <div className="generic-note">
            <span className="note-icon" aria-hidden="true">{'{ }'}</span>
            <p><strong>One list, any type.</strong><br />The generic List component handles each book with a custom renderer.</p>
          </div>
        </aside>

        <section className="shelf-panel" aria-labelledby="shelf-heading">
          <div className="shelf-heading">
            <div>
              <p className="section-label">YOUR COLLECTION</p>
              <h2 id="shelf-heading">The bookshelf</h2>
            </div>
            <span className="shelf-count">{books.length} {books.length === 1 ? 'book' : 'books'}</span>
          </div>

          <List
            items={books}
            getKey={(book) => book.id}
            renderItem={renderBook}
            emptyMessage="Your shelf is ready for its first story."
          />
          <p className="shelf-footer">
            <span className="shelf-dot" aria-hidden="true" />
            Every good list starts somewhere.
          </p>
        </section>
      </section>

      <footer className="page-footer">
        <span>Built with React, TypeScript &amp; a little curiosity.</span>
        <span>WEEK 10 <i>/</i> DAY 01</span>
      </footer>
    </main>
  )
}
