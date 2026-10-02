import { useState } from 'react'
import Car from './Components/Car.jsx'
import Events from './Components/Events.jsx'
import Phone from './Components/Phone.jsx'
import Color from './Components/Color.jsx'
import Forms from './Components/Forms.jsx'
import FormExercises from './Components/FormExercises.jsx'
import Clock from './Components/Clock.jsx'
import Form from './Components/Form.jsx'

const carinfo = { name: 'Ford', model: 'Mustang' }

function App() {
  const [languages, setLanguages] = useState([
    { name: 'Php', votes: 0 },
    { name: 'Python', votes: 0 },
    { name: 'JavaScript', votes: 0 },
    { name: 'Java', votes: 0 },
  ])

  const addVote = (languageName) => {
    setLanguages((currentLanguages) => currentLanguages.map((language) => (
      language.name === languageName
        ? { ...language, votes: language.votes + 1 }
        : language
    )))
  }

  return (
    <main className="app-shell">
      <header className="page-heading">
        <p className="eyebrow">WEEK 7 / DAY 5</p>
        <h1>React Exercises</h1>
        <p className="intro">Components, events, state, and effects.</p>
      </header>

      <section className="exercise" aria-labelledby="car-title">
        <div className="exercise-heading">
          <span className="exercise-number">01</span>
          <h2 id="car-title">Car and components</h2>
        </div>
        <Car carinfo={carinfo} />
      </section>

      <section className="exercise" aria-labelledby="events-title">
        <div className="exercise-heading">
          <span className="exercise-number">02</span>
          <h2 id="events-title">Events</h2>
        </div>
        <Events />
      </section>

      <section className="exercise" aria-labelledby="phone-title">
        <div className="exercise-heading">
          <span className="exercise-number">03</span>
          <h2 id="phone-title">Phone and state</h2>
        </div>
        <Phone />
      </section>

      <section className="exercise" aria-labelledby="color-title">
        <div className="exercise-heading">
          <span className="exercise-number">04</span>
          <h2 id="color-title">The useEffect hook</h2>
        </div>
        <Color />
      </section>

      <section className="exercise" aria-labelledby="forms-title">
        <div className="exercise-heading">
          <span className="exercise-number">05</span>
          <h2 id="forms-title">Forms</h2>
        </div>
        <Forms />
      </section>

      <section className="exercise" aria-labelledby="form-data-title">
        <div className="exercise-heading">
          <span className="exercise-number">06</span>
          <h2 id="form-data-title">Form data and validation</h2>
        </div>
        <FormExercises />
      </section>

      <section className="exercise" aria-labelledby="clock-title">
        <div className="exercise-heading">
          <span className="exercise-number">07</span>
          <h2 id="clock-title">Local time clock</h2>
        </div>
        <Clock />
      </section>

      <section className="exercise" aria-labelledby="ninja-form-title">
        <div className="exercise-heading">
          <span className="exercise-number">08</span>
          <h2 id="ninja-form-title">Form validation</h2>
        </div>
        <Form />
      </section>

      <section className="exercise" aria-labelledby="voting-title">
        <div className="exercise-heading">
          <span className="exercise-number">09</span>
          <h2 id="voting-title">Vote for your favorite language</h2>
        </div>
        <div className="language-votes">
          {languages.map((language) => (
            <div className="language-vote-row" key={language.name}>
              <h3>{language.name}</h3>
              <p>
                <strong>{language.votes}</strong>{' '}
                {language.votes === 1 ? 'vote' : 'votes'}
              </p>
              <button
                type="button"
                onClick={() => addVote(language.name)}
                aria-label={`Vote for ${language.name}`}
              >
                Vote
              </button>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}

export default App