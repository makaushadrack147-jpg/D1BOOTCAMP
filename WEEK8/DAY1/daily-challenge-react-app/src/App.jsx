import { Component } from 'react'
import FormComponent from './FormComponent.jsx'

const readFormDataFromUrl = () => {
  const params = new URLSearchParams(window.location.search)

  return {
    firstName: params.get('firstName') ?? '',
    lastName: params.get('lastName') ?? '',
    age: params.get('age') ?? '',
    gender: params.get('gender') ?? '',
    destination: params.get('destination') ?? '',
    nutsFree: params.get('nutsFree') === 'on' ? 'on' : '',
    lactoseFree: params.get('lactoseFree') === 'on' ? 'on' : '',
    vegan: params.get('vegan') === 'on' ? 'on' : '',
  }
}

class FormContainer extends Component {
  state = { formData: readFormDataFromUrl() }

  handleChange = (event) => {
    const { checked, name, type, value } = event.target
    const fieldValue = type === 'checkbox' ? (checked ? 'on' : '') : value

    this.setState(({ formData }) => ({
      formData: { ...formData, [name]: fieldValue },
    }))
  }

  render() {
    return (
      <main className="page-shell">
        <header className="masthead">
          <a className="brand" href="/" aria-label="Form container home">
            <span className="brand-mark">F</span>
            <span>FIELD / FORM</span>
          </a>
          <span className="lesson-tag">WEEK 08 <span>/</span> DAY 01</span>
        </header>

        <section className="page-intro">
          <p className="eyebrow">REACT / CONTROLLED INPUTS</p>
          <h1>Plan your <em>next trip.</em></h1>
          <p className="intro-copy">Your details update as you fill in the form.</p>
        </section>

        <FormComponent
          formData={this.state.formData}
          onChange={this.handleChange}
        />

        <footer className="page-footer">
          <span>FORM CONTAINER</span>
          <span>INPUT <i>→</i> STATE <i>→</i> URL</span>
        </footer>
      </main>
    )
  }
}

export default FormContainer