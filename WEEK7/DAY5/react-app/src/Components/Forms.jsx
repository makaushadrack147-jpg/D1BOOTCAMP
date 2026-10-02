import { useState } from 'react'

function Forms() {
  const [username, setUsername] = useState('')
  const [age, setAge] = useState(null)
  const [errorMessage, setErrorMessage] = useState('')
  const [message, setMessage] = useState('Hello there!')
  const [car, setCar] = useState('Volvo')

  const handleAgeChange = (event) => {
    const value = event.target.value
    setAge(value)

    if (value.trim() !== '' && !Number.isFinite(Number(value))) {
      setErrorMessage('Your age must be a number')
    } else {
      setErrorMessage('')
    }
  }

  const mySubmitHandler = (event) => {
    event.preventDefault()
    window.alert(username)
  }

  let header = null
  if (username) {
    header = <h3>Hello {username}</h3>
  }

  return (
    <div className="demo-content forms-content">
      {header}
      <form className="user-form" onSubmit={mySubmitHandler}>
        <label htmlFor="form-username">Name</label>
        <input
          id="form-username"
          name="username"
          type="text"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
        />

        <label htmlFor="form-age">Age</label>
        <input
          id="form-age"
          name="age"
          type="text"
          inputMode="numeric"
          value={age ?? ''}
          onChange={handleAgeChange}
          aria-invalid={Boolean(errorMessage)}
          aria-describedby={errorMessage ? 'age-error' : undefined}
        />
        {errorMessage && <p className="form-error" id="age-error">{errorMessage}</p>}

        {username && age !== null && age.trim() !== '' && !errorMessage && (
          <h3 className="user-summary">{username} is {age} years old</h3>
        )}

        <button type="submit">Submit</button>
      </form>

      <div className="form-extra">
        <label htmlFor="form-message">Message</label>
        <textarea
          id="form-message"
          name="message"
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          rows="3"
        />

        <label htmlFor="form-car">Choose a car</label>
        <select
          id="form-car"
          name="car"
          value={car}
          onChange={(event) => setCar(event.target.value)}
        >
          <option value="Volvo">Volvo</option>
          <option value="Saab">Saab</option>
          <option value="Mercedes">Mercedes</option>
          <option value="Audi">Audi</option>
        </select>
      </div>
    </div>
  )
}

export default Forms