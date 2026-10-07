import axios from 'axios'
import { Component } from 'react'

class AxiosPostForm extends Component {
  constructor(props) {
    super(props)
    this.state = { userId: '', title: '', body: '', status: '', isSubmitting: false }
  }

  handleChange = (event) => {
    const { name, value } = event.target
    this.setState({ [name]: value })
  }

  handleSubmit = async (event) => {
    event.preventDefault()
    const { userId, title, body } = this.state
    this.setState({ isSubmitting: true, status: '' })

    try {
      const response = await axios.post('https://jsonplaceholder.typicode.com/posts', {
        userId: Number(userId),
        title,
        body,
      })
      console.log('Axios POST response:', response.data)
      this.setState({ status: `Posted post #${response.data.id}. See the browser console for the response.` })
    } catch (error) {
      console.error('Axios POST failed:', error)
      this.setState({ status: 'The post could not be sent. Check your connection and try again.' })
    } finally {
      this.setState({ isSubmitting: false })
    }
  }

  render() {
    const { userId, title, body, status, isSubmitting } = this.state

    return (
      <article className="api-post-form axios-form">
        <p className="section-kicker">08 / AXIOS</p>
        <h2>Post an article</h2>
        <form onSubmit={this.handleSubmit}>
          <label htmlFor="axios-user-id">User ID</label>
          <input className="api-form-input" id="axios-user-id" name="userId" onChange={this.handleChange} placeholder="1" required type="number" value={userId} />
          <label htmlFor="axios-title">Title</label>
          <input className="api-form-input" id="axios-title" name="title" onChange={this.handleChange} placeholder="Post title" required type="text" value={title} />
          <label htmlFor="axios-body">Body</label>
          <input className="api-form-input" id="axios-body" name="body" onChange={this.handleChange} placeholder="Write a short post" required type="text" value={body} />
          <button className="send-button" disabled={isSubmitting} type="submit">{isSubmitting ? 'Posting...' : 'Submit post'}<span aria-hidden="true">↗</span></button>
        </form>
        <p aria-live="polite" className="api-post-status">{status || 'POST /posts'}</p>
      </article>
    )
  }
}

export default AxiosPostForm