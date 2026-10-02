import { useState } from 'react'
import Input from './Input.jsx'

const initialFormData = {
  firstName: '',
  lastName: '',
  phone: '',
  email: '',
}

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const phonePattern = /^\+?[0-9][0-9\s().-]*$/

function validateField(name, value) {
  const trimmedValue = value.trim()

  if (!trimmedValue) {
    return 'This field is required.'
  }

  if (name === 'phone') {
    const digitCount = trimmedValue.replace(/\D/g, '').length
    if (!phonePattern.test(trimmedValue) || digitCount < 7 || digitCount > 15) {
      return 'Enter a valid phone number.'
    }
  }

  if (name === 'email' && !emailPattern.test(trimmedValue)) {
    return 'Enter a valid email address.'
  }

  return ''
}

function Form() {
  const [formData, setFormData] = useState(initialFormData)
  const [errors, setErrors] = useState({})
  const [submittedData, setSubmittedData] = useState(null)

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((currentData) => ({ ...currentData, [name]: value }))

    if (errors[name]) {
      const error = validateField(name, value)
      setErrors((currentErrors) => {
        const nextErrors = { ...currentErrors }
        if (error) {
          nextErrors[name] = error
        } else {
          delete nextErrors[name]
        }
        return nextErrors
      })
    }
  }

  const handleBlur = (event) => {
    const { name, value } = event.target
    const error = validateField(name, value)
    setErrors((currentErrors) => {
      const nextErrors = { ...currentErrors }
      if (error) {
        nextErrors[name] = error
      } else {
        delete nextErrors[name]
      }
      return nextErrors
    })
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const nextErrors = Object.fromEntries(
      Object.entries(formData)
        .map(([name, value]) => [name, validateField(name, value)])
        .filter(([, error]) => error),
    )
    setErrors(nextErrors)

    if (Object.keys(nextErrors).length === 0) {
      setSubmittedData({ ...formData })
    }
  }

  const handleReset = () => {
    setFormData({ ...initialFormData })
    setErrors({})
    setSubmittedData(null)
  }

  if (submittedData) {
    return (
      <div className="submitted-details" aria-live="polite">
        <p><strong>First name:</strong> {submittedData.firstName}</p>
        <p><strong>Last name:</strong> {submittedData.lastName}</p>
        <p><strong>Phone:</strong> {submittedData.phone}</p>
        <p><strong>Email:</strong> {submittedData.email}</p>
        <button type="button" onClick={handleReset}>Reset</button>
      </div>
    )
  }

  return (
    <form className="validation-form" onSubmit={handleSubmit} noValidate>
      <Input
        id="ninja-first-name"
        label="First Name"
        name="firstName"
        value={formData.firstName}
        onChange={handleChange}
        onBlur={handleBlur}
        error={errors.firstName}
      />
      <Input
        id="ninja-last-name"
        label="Last Name"
        name="lastName"
        value={formData.lastName}
        onChange={handleChange}
        onBlur={handleBlur}
        error={errors.lastName}
      />
      <Input
        id="ninja-phone"
        label="Phone"
        name="phone"
        value={formData.phone}
        onChange={handleChange}
        onBlur={handleBlur}
        error={errors.phone}
        inputMode="tel"
      />
      <Input
        id="ninja-email"
        label="Email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        onBlur={handleBlur}
        error={errors.email}
        inputMode="email"
      />
      <button type="submit">Submit</button>
    </form>
  )
}

export default Form