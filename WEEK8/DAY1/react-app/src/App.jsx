import { Component } from 'react'
import ErrorBoundary from './ErrorBoundary.jsx'
import FormContainer from './FormContainer.jsx'

class BuggyCounter extends Component {
  state = { counter: 0 }

  handleClick = () => {
    this.setState(({ counter }) => ({ counter: counter + 1 }))
  }

  render() {
    if (this.state.counter >= 5) {
      throw new Error('I crashed!')
    }

    return (
      <button className="counter-button" onClick={this.handleClick} type="button">
        <span className="counter-value">{this.state.counter}</span>
        <span className="counter-caption">Click to count</span>
      </button>
    )
  }
}

class Child extends Component {
  componentWillUnmount() {
    window.alert('The child component has unmounted.')
  }

  render() {
    return <h3 className="hello-world">Hello World!</h3>
  }
}

class LifecycleExercise extends Component {
  state = { favoriteColor: 'red', show: true }

  componentDidMount() {
    this.colorTimer = window.setTimeout(() => {
      this.setState({ favoriteColor: 'yellow' })
    }, 2000)
  }

  componentWillUnmount() {
    window.clearTimeout(this.colorTimer)
  }

  shouldComponentUpdate() {
    return true
  }

  getSnapshotBeforeUpdate() {
    console.log('in getSnapshotBeforeUpdate')
    return null
  }

  componentDidUpdate() {
    console.log('after update')
  }

  handleColorChange = () => {
    window.clearTimeout(this.colorTimer)
    this.setState({ favoriteColor: 'blue' })
  }

  handleDelete = () => {
    this.setState({ show: false })
  }

  render() {
    const colorClass = `color-swatch color-${this.state.favoriteColor}`

    return (
      <div className="lifecycle-grid">
        <section className="demo-block">
          <p className="status-label">UPDATING</p>
          <h3>Favorite color</h3>
          <p className="demo-copy">
            Starts red, changes to yellow after mounting, or switch it to blue.
          </p>
          <div className={colorClass} aria-live="polite">
            {this.state.favoriteColor}
          </div>
          <button className="action-button" onClick={this.handleColorChange} type="button">
            Change to blue <span aria-hidden="true">↗</span>
          </button>
          <p className="console-note">Open DevTools to see the update lifecycle logs.</p>
        </section>

        <section className="demo-block unmount-block">
          <p className="status-label">UNMOUNTING</p>
          <h3>Remove a child</h3>
          <p className="demo-copy">Delete the child to run componentWillUnmount().</p>
          {this.state.show ? (
            <div className="child-output"><Child /></div>
          ) : (
            <p className="removed-message">Child removed from the DOM.</p>
          )}
          {this.state.show && (
            <button className="action-button action-button-dark" onClick={this.handleDelete} type="button">
              Delete child <span aria-hidden="true">×</span>
            </button>
          )}
        </section>
      </div>
    )
  }
}

const simulations = [
  { id: 'shared', label: '01 / Shared boundary' },
  { id: 'separate', label: '02 / Separate boundaries' },
  { id: 'none', label: '03 / No boundary' },
]

const hasFormQuery = () => {
  const params = new URLSearchParams(window.location.search)
  return ['firstName', 'lastName', 'age', 'gender', 'destination', 'nutsFree', 'lactoseFree', 'vegan']
    .some((field) => params.has(field))
}

class App extends Component {
  state = {
    activeExercise: hasFormQuery() ? 'form' : 'boundaries',
    simulation: 'shared',
  }

  selectExercise = (activeExercise) => {
    this.setState({ activeExercise })
  }

  selectSimulation = (simulation) => {
    this.setState({ simulation })
  }

  renderCounters() {
    if (this.state.simulation === 'shared') {
      return (
        <ErrorBoundary key="shared">
          <div className="counter-grid">
            <BuggyCounter />
            <BuggyCounter />
          </div>
        </ErrorBoundary>
      )
    }

    if (this.state.simulation === 'separate') {
      return (
        <div className="counter-grid">
          <ErrorBoundary key="left"><BuggyCounter /></ErrorBoundary>
          <ErrorBoundary key="right"><BuggyCounter /></ErrorBoundary>
        </div>
      )
    }

    return (
      <div className="counter-grid">
        <BuggyCounter />
      </div>
    )
  }

  render() {
    const showingBoundaries = this.state.activeExercise === 'boundaries'
    const showingLifecycle = this.state.activeExercise === 'lifecycle'
    const showingForm = this.state.activeExercise === 'form'

    return (
      <main className="app-shell">
        <header className="topbar">
          <a className="wordmark" href="#top" aria-label="React Lifecycle Lab home">
            <span className="wordmark-mark">R</span>
            <span>COMPONENT STUDIES</span>
          </a>
          <span className="topbar-meta">WEEK 08 <span>/</span> DAY 01</span>
        </header>

        <section className="intro" id="top">
          <div>
            <p className="eyebrow">{showingForm ? 'REACT / FORM STATE' : 'REACT / CLASS COMPONENTS'}</p>
            <h1>
              {showingForm
                ? <>React <em>form</em><br />container</>
                : <>Lifecycle <em>&</em><br />error boundaries</>}
            </h1>
          </div>
          <p className="intro-side">
            {showingForm
              ? 'Enter traveler details and watch controlled form state update as you type.'
              : 'A hands-on study of what happens when components update, disappear, or fail.'}
          </p>
        </section>

        <nav className="exercise-tabs" aria-label="Exercises">
          <button
            className={showingBoundaries ? 'exercise-tab active' : 'exercise-tab'}
            onClick={() => this.selectExercise('boundaries')}
            type="button"
            aria-pressed={showingBoundaries}
          >
            <span>01</span> Error boundaries
          </button>
          <button
            className={showingLifecycle ? 'exercise-tab active' : 'exercise-tab'}
            onClick={() => this.selectExercise('lifecycle')}
            type="button"
            aria-pressed={showingLifecycle}
          >
            <span>02–03</span> Lifecycle
          </button>
          <button
            className={showingForm ? 'exercise-tab active' : 'exercise-tab'}
            onClick={() => this.selectExercise('form')}
            type="button"
            aria-pressed={showingForm}
          >
            <span>04</span> Daily challenge
          </button>
        </nav>

        {showingBoundaries ? (
          <section className="workbench" aria-labelledby="boundary-heading">
            <div className="section-heading">
              <div>
                <p className="eyebrow">EXERCISE 01</p>
                <h2 id="boundary-heading">Contain the crash</h2>
              </div>
              <p className="section-description">Each counter throws at five. Choose how much of the component tree one boundary protects.</p>
            </div>

            <div className="simulation-tabs" role="group" aria-label="Error boundary simulation">
              {simulations.map((simulation) => (
                <button
                  className={this.state.simulation === simulation.id ? 'simulation-tab selected' : 'simulation-tab'}
                  key={simulation.id}
                  onClick={() => this.selectSimulation(simulation.id)}
                  type="button"
                  aria-pressed={this.state.simulation === simulation.id}
                >
                  {simulation.label}
                </button>
              ))}
            </div>

            <div className="simulation-note">
              <span className="note-icon" aria-hidden="true">i</span>
              <p>
                {this.state.simulation === 'shared' && 'One boundary wraps both counters. When either fails, both are replaced.'}
                {this.state.simulation === 'separate' && 'Each counter has its own boundary. One can fail while the other keeps working.'}
                {this.state.simulation === 'none' && 'No boundary is present. When the counter fails, the whole React tree goes blank.'}
              </p>
            </div>

            <div className="counter-stage" key={this.state.simulation}>
              {this.renderCounters()}
            </div>
            {this.state.simulation === 'none' && (
              <p className="reset-hint">If the page goes blank, reload it to reset the unhandled error.</p>
            )}
          </section>
        ) : showingLifecycle ? (
          <section className="workbench" aria-labelledby="lifecycle-heading">
            <div className="section-heading">
              <div>
                <p className="eyebrow">EXERCISES 02–03</p>
                <h2 id="lifecycle-heading">Watch the lifecycle</h2>
              </div>
              <p className="section-description">Try an update, then remove a child component to observe the class lifecycle methods.</p>
            </div>
            <LifecycleExercise key="lifecycle" />
          </section>
        ) : (
          <section className="workbench" aria-labelledby="form-heading">
            <div className="section-heading">
              <div>
                <p className="eyebrow">DAILY CHALLENGE</p>
                <h2 id="form-heading">Traveler information</h2>
              </div>
              <p className="section-description">Complete the form to see each value update and submit the data in the URL.</p>
            </div>
            <FormContainer key="form" />
          </section>
        )}

        <footer className="page-footer">
          <span>REACT LAB NOTES</span>
          <span>STATE → RENDER → COMMIT</span>
        </footer>
      </main>
    )
  }
}

export default App