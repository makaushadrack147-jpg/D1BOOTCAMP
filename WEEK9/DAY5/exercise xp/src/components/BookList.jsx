import { useState } from 'react'
import { useSelector } from 'react-redux'
import {
  selectBooks,
  selectFantasyBooks,
  selectHorrorBooks,
  selectScienceFictionBooks,
} from '../store/selectors.js'

const genres = [
  { label: 'All books', value: 'all' },
  { label: 'Horror', value: 'Horror' },
  { label: 'Fantasy', value: 'Fantasy' },
  { label: 'Science fiction', value: 'Science Fiction' },
]

const bookSelectors = {
  all: selectBooks,
  Horror: selectHorrorBooks,
  Fantasy: selectFantasyBooks,
  'Science Fiction': selectScienceFictionBooks,
}

const genreDescriptions = {
  all: 'A little something for every kind of reader.',
  Horror: 'For stories that linger after the lights go out.',
  Fantasy: 'Step into worlds just beyond the ordinary.',
  'Science Fiction': 'Big ideas and journeys beyond our world.',
}

function BookCard({ book, number }) {
  return (
    <li className="book-card">
      <div className={`book-cover cover-${book.accent}`} aria-hidden="true">
        <span className="cover-mark">✳</span>
        <span className="cover-number">{String(number).padStart(2, '0')}</span>
      </div>
      <div className="book-details">
        <span className="book-genre">{book.genre}</span>
        <h3>{book.title}</h3>
        <p>by {book.author}</p>
      </div>
      <span className="book-arrow" aria-hidden="true">↗</span>
    </li>
  )
}

export default function BookList() {
  const [selectedGenre, setSelectedGenre] = useState('all')
  const books = useSelector((state) => bookSelectors[selectedGenre](state))
  const allBooks = useSelector(selectBooks)

  return (
    <section className="collection" aria-labelledby="collection-heading">
      <div className="collection-heading">
        <div>
          <p className="eyebrow">THE COLLECTION</p>
          <h2 id="collection-heading">
            {selectedGenre === 'all' ? 'A shelf of stories' : `${selectedGenre} shelf`}
          </h2>
          <p className="collection-description">{genreDescriptions[selectedGenre]}</p>
        </div>
        <span className="book-count">
          <strong>{books.length}</strong> {books.length === 1 ? 'book' : 'books'}
        </span>
      </div>

      <div className="genre-controls" role="group" aria-label="Filter books by genre">
        {genres.map((genre) => (
          <button
            key={genre.value}
            className={`genre-button${selectedGenre === genre.value ? ' is-active' : ''}`}
            type="button"
            aria-pressed={selectedGenre === genre.value}
            onClick={() => setSelectedGenre(genre.value)}
          >
            {genre.label}
            {genre.value !== 'all' && (
              <span className="genre-count">
                {allBooks.filter((book) => book.genre === genre.value).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {books.length > 0 ? (
        <ul className="book-list" aria-live="polite">
          {books.map((book, index) => (
            <BookCard key={book.id} book={book} number={index + 1} />
          ))}
        </ul>
      ) : (
        <p className="empty-state">There are no books in this genre yet.</p>
      )}

      <p className="selector-note">
        <span className="selector-dot" aria-hidden="true" />
        Genre lists are derived with memoized Redux selectors.
      </p>
    </section>
  )
}
