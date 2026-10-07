import { Component } from 'react'

class App extends Component {
  state = {
    helloMessage: 'Connecting to Express...',
    inputValue: '',
    serverReply: '',
    requestError: '',
    isSending: false,
  }

  async componentDidMount() {
    try {
      const response = await fetch('/api/hello')
      if (!response.ok) throw new Error(`Request failed: ${response.status}`)
      const data = await response.json()
      this.setState({ helloMessage: data.message })
    } catch (error) {
      this.setState({ helloMessage: 'Could not connect to Express.' })
      console.error('Could not load the hello message:', error)
    }
  }

  handleChange = (event) => {
    this.setState({ inputValue: event.target.value })
  }

  handleSubmit = async (event) => {
    event.preventDefault()
    this.setState({ isSending: true, requestError: '' })

    try {
      const response = await fetch('/api/world', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ inputValue: this.state.inputValue }),
      })
      if (!response.ok) throw new Error(`Request failed: ${response.status}`)
      const data = await response.json()
      this.setState({ serverReply: data.message })
    } catch (error) {
      this.setState({ requestError: 'The message could not be sent. Check that the server is running.' })
      console.error('Could not send the message:', error)
    } finally {
      this.setState({ isSending: false })
    }
  }

  render() {
    return (
      <main className="page-shell">
        <header className="page-header">
          <p className="eyebrow">WEEK 08 / DAY 02</p>
          <h1>{this.state.helloMessage}</h1>
          <p className="header-note">A React form talking to an Express API.</p>
        </header>

        <section className="message-section" aria-labelledby="message-title">
          <div className="section-label">
            <span className="section-index">01</span>
            <h2 id="message-title">Send a message</h2>
          </div>
          <form onSubmit={this.handleSubmit}>
            <label htmlFor="message-input">Message for the server</label>
            <div className="input-row">
              <input
                autoComplete="off"
                id="message-input"
                onChange={this.handleChange}
                placeholder="Type something to send..."
                required
                value={this.state.inputValue}
              />
              <button disabled={this.state.isSending} type="submit">
                {this.state.isSending ? 'Sending...' : 'Send'}
                <span aria-hidden="true">↗</span>
              </button>
            </div>
            {this.state.serverReply && <p aria-live="polite" className="server-reply">{this.state.serverReply}</p>}
            {this.state.requestError && <p aria-live="polite" className="request-error">{this.state.requestError}</p>}
          </form>
          <p className="route-note"><code>POST /api/world</code><span>JSON request body</span></p>
        </section>
      </main>
    )
  }
}

export default App