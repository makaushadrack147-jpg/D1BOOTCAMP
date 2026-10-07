import { Component } from 'react'
class ErrorBoundary extends Component {
  state = { hasError: false }
  componentDidCatch(error, errorInfo) {
    this.setState({ hasError: true })
    console.error('Caught by ErrorBoundary:', error, errorInfo)
  }
  render() {
    if (this.state.hasError) {
      return (
        <section className="error-state" role="alert">
          <p className="section-kicker">ROUTE ERROR</p>
          <h1>This screen could not load.</h1>
          <p>The rest of the app is still available. Choose another page above.</p>
        </section>
      )
    }
    return this.props.children
  }
}
export default ErrorBoundary