import { Component } from 'react'

class ErrorBoundary extends Component {
  state = { error: null, errorInfo: null }

  componentDidCatch(error, errorInfo) {
    this.setState({ error, errorInfo })
    console.error('Caught by ErrorBoundary:', error, errorInfo)
  }

  render() {
    if (this.state.error) {
      return (
        <section className="crash-panel" role="alert">
          <p className="status-label">BOUNDARY CAUGHT AN ERROR</p>
          <h3>This counter crashed.</h3>
          <p>The rest of this boundary has been replaced by this fallback.</p>
          <details className="error-details">
            <summary>Error details</summary>
            <div style={{ whiteSpace: 'pre-wrap' }}>
              {this.state.error.toString()}
              <br />
              {this.state.errorInfo?.componentStack}
            </div>
          </details>
        </section>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary