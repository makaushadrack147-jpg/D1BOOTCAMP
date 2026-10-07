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
      <FormComponent
        formData={this.state.formData}
        onChange={this.handleChange}
      />
    )
  }
}

export default FormContainer