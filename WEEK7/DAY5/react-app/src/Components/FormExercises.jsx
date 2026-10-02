import { useState } from 'react'

const emptyBook = {
  title: '',
  author: '',
  genre: '',
  review: '',
}

const emptyUser = {
  firstName: '',
  lastName: '',
  phone: '',
  email: '',
}

function FormExercises() {
  const [book, setBook] = useState(emptyBook)
  const [bookSubmitted, setBookSubmitted] = useState(false)
  const [user, setUser] = useState(emptyUser)
  const [userSubmitted, setUserSubmitted] = useState(false)

  const handleBookChange = (event) => {
    const { name, value } = event.target
    setBook((currentBook) => ({ ...currentBook, [name]: value }))
  }

  const handleBookSubmit = (event) => {
    event.preventDefault()
    console.log(book)
    setBookSubmitted(true)
  }

  const handleUserChange = (event) => {
    const { name, value } = event.target
    setUser((currentUser) => ({ ...currentUser, [name]: value }))
  }

  const handleUserSubmit = (event) => {
    event.preventDefault()
    setUserSubmitted(true)
  }

  const resetUserForm = () => {
    setUser(emptyUser)
    setUserSubmitted(false)
  }

  return (
    <div className="form-exercises">
      <section className="form-task" aria-labelledby="book-form-title">
        <h3 id="book-form-title">Book details</h3>
        {bookSubmitted && <p className="form-success" role="status">Book submitted successfully.</p>}
        <form className="exercise-form" onSubmit={handleBookSubmit}>
          <label htmlFor="book-title">Title</label>
          <input
            id="book-title"
            name="title"
            value={book.title}
            onChange={handleBookChange}
            required
          />

          <label htmlFor="book-author">Author</label>
          <input
            id="book-author"
            name="author"
            value={book.author}
            onChange={handleBookChange}
            required
          />

          <label htmlFor="book-genre">Genre</label>
          <input
            id="book-genre"
            name="genre"
            value={book.genre}
            onChange={handleBookChange}
            required
          />

          <label htmlFor="book-review">Review</label>
          <textarea
            id="book-review"
            name="review"
            value={book.review}
            onChange={handleBookChange}
            rows="4"
            required
          />

          <button type="submit">Submit book</button>
        </form>
      </section>

      <section className="form-task" aria-labelledby="user-form-title">
        <h3 id="user-form-title">Your details</h3>
        {userSubmitted ? (
          <div className="submitted-user" aria-live="polite">
            <p><strong>First name:</strong> {user.firstName}</p>
            <p><strong>Last name:</strong> {user.lastName}</p>
            <p><strong>Phone:</strong> {user.phone}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <button type="button" onClick={resetUserForm}>Reset</button>
          </div>
        ) : (
          <form className="exercise-form" onSubmit={handleUserSubmit}>
            <label htmlFor="user-first-name">First name</label>
            <input
              id="user-first-name"
              name="firstName"
              autoComplete="given-name"
              value={user.firstName}
              onChange={handleUserChange}
              required
            />

            <label htmlFor="user-last-name">Last name</label>
            <input
              id="user-last-name"
              name="lastName"
              autoComplete="family-name"
              value={user.lastName}
              onChange={handleUserChange}
              required
            />

            <label htmlFor="user-phone">Phone</label>
            <input
              id="user-phone"
              name="phone"
              type="tel"
              autoComplete="tel"
              pattern="[0-9+() .-]{7,20}"
              title="Enter a valid phone number."
              value={user.phone}
              onChange={handleUserChange}
              required
            />

            <label htmlFor="user-email">Email</label>
            <input
              id="user-email"
              name="email"
              type="email"
              autoComplete="email"
              value={user.email}
              onChange={handleUserChange}
              required
            />

            <button type="submit">Submit</button>
          </form>
        )}
      </section>
    </div>
  )
}

export default FormExercises