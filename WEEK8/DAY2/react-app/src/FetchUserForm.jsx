import { Component } from 'react'

class FetchUserForm extends Component {
  constructor(props) {
    super(props)
    this.state = { user: '', email: '', status: '', isSubmitting: false }
  }

  handleChange = (event) => {
    const { name, value } = event.target
    this.setState({ [name]: value })
  }

  handleSubmit = async (event) => {
    event.preventDefault()
    const { user, email } = this.state
    this.setState({ isSubmitting: true, status: '' })

    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/users/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user, email }),
      })
      if (!response.ok) throw new Error(`Request failed: ${response.status}`)
      const data = await response.json()
      console.log('Fetch POST response:', data)
      this.setState({ status: `Posted user record #${data.id}. See the browser console for the response.` })
    } catch (error) {
      console.error('Fetch POST failed:', error)
      this.setState({ status: 'The user could not be posted. Check your connection and try again.' })
    } finally {
      this.setState({ isSubmitting: false })
    }
  }

  render() {
    const { user, email, status, isSubmitting } = this.state

    return (
      <article className="api-post-form">
        <p className="section-kicker">07 / FETCH</p>
        <h2>Post a user</h2>
        <form onSubmit={this.handleSubmit}>
          <label htmlFor="fetch-user">User</label>
          <input className="api-form-input" id="fetch-user" name="user" onChange={this.handleChange} placeholder="Your name" required type="text" value={user} />
          <label htmlFor="fetch-email">Email</label>
          <input className="api-form-input" id="fetch-email" name="email" onChange={this.handleChange} placeholder="you@example.com" required type="email" value={email} />
          <button className="send-button" disabled={isSubmitting} type="submit">{isSubmitting ? 'Posting...' : 'Submit user'}<span aria-hidden="true">↗</span></button>
        </form>
        <p aria-live="polite" className="api-post-status">{status || 'POST /users'}</p>
      </article>
    )
  }
}

export default FetchUserForm