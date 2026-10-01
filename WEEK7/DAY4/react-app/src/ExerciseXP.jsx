import UserFavoriteAnimals from './UserFavoriteAnimals'
import Exercise from './Exercise3'

const user = {
  firstName: 'Bob',
  lastName: 'Dylan',
  favAnimals: ['Horse', 'Turtle', 'Elephant', 'Monkey'],
}

function ExerciseXP() {
  const myelement = <h1>I Love JSX!</h1>
  const sum = 5 + 5

  return (
    <>
      <header className="page-header">
        <p className="eyebrow">WEEK 7 / DAY 4</p>
        <h1>React Exercises</h1>
        <p className="header-note">JSX, props, and HTML elements</p>
      </header>

      <section className="exercise-section" aria-labelledby="jsx-title">
        <p className="section-label">01 / JSX</p>
        <h2 id="jsx-title">A little JSX goes a long way</h2>
        <p>Hello World!</p>
        {myelement}
        <p>React is {sum} times better with JSX</p>
      </section>

      <section className="exercise-section" aria-labelledby="object-title">
        <p className="section-label">02 / OBJECTS &amp; PROPS</p>
        <h2 id="object-title">Meet the user</h2>
        <div className="user-name">
          <h3>{user.firstName}</h3>
          <h3>{user.lastName}</h3>
        </div>
        <UserFavoriteAnimals favAnimals={user.favAnimals} />
      </section>

      <section className="exercise-section exercise-three" aria-labelledby="html-title">
        <p className="section-label">03 / HTML TAGS</p>
        <h2 id="html-title">A collection of elements</h2>
        <Exercise />
      </section>
    </>
  )
}

export default ExerciseXP