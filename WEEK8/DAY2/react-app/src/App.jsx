import { useState } from 'react'
import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom'
import ErrorBoundary from './ErrorBoundary.jsx'
import Example1 from './Example1.jsx'
import Example2 from './Example2.jsx'
import Example3 from './Example3.jsx'
import PostList from './PostList.jsx'
import FetchUserForm from './FetchUserForm.jsx'
import AxiosPostForm from './AxiosPostForm.jsx'
const payload = { key1: 'myusername', email: 'mymail@gmail.com', name: 'Isaac', lastname: 'Doe', age: 27 }
function HomeScreen() {
  const [webhookUrl, setWebhookUrl] = useState('')
  const [postStatus, setPostStatus] = useState('')
  const sendJson = async (event) => {
    event.preventDefault()
    setPostStatus('Sending request...')
    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const responseText = await response.text()
      let responseBody = responseText
      try {
        responseBody = responseText ? JSON.parse(responseText) : null
      } catch {
        responseBody = responseText
      }
      console.log('Webhook response:', response, responseBody)
      setPostStatus(`Response received: ${response.status} ${response.statusText}`)
    } catch (error) {
      console.error('Webhook request failed:', error)
      setPostStatus(error.message || 'The request failed. Check the webhook URL and CORS setting.')
    }
  }
  return (
    <>
      <header className="page-intro">
        <div><p className="section-kicker">WEEK 08 / DAY 02</p><h1>State, routes <em>&amp; JSON</em></h1></div>
        <p className="intro-note">Router boundaries, nested data, and two ways to POST form data.</p>
      </header>
      <div className="lesson-grid">
        <div className="lesson-main"><PostList /><Example1 /><Example2 /><Example3 /></div>
        <aside className="post-panel" aria-labelledby="post-json-heading">
          <p className="section-kicker">06 / FETCH + POST</p>
          <h2 id="post-json-heading">Send JSON</h2>
          <p className="panel-copy">Paste your webhook.site unique URL. Enable CORS there before sending.</p>
          <form onSubmit={sendJson}>
            <label htmlFor="webhook-url">Webhook URL</label>
            <input autoComplete="url" id="webhook-url" onChange={(event) => setWebhookUrl(event.target.value)} placeholder="https://webhook.site/..." required type="url" value={webhookUrl} />
            <button className="send-button" type="submit">Send POST <span aria-hidden="true">↗</span></button>
          </form>
          <pre className="payload-preview">{JSON.stringify(payload, null, 2)}</pre>
          <p aria-live="polite" className="request-status">{postStatus || 'Response details are logged in the browser console.'}</p>
        </aside>
      </div>
      <section className="api-post-exercises" aria-label="JSON POST exercises">
        <FetchUserForm />
        <AxiosPostForm />
      </section>
    </>
  )
}
function ProfileScreen() {
  return <section className="route-screen"><p className="section-kicker">ROUTE / PROFILE</p><h1>Profile Screen</h1></section>
}
function ShopScreen() {
  throw new Error('Shop is out of stock!')
}
function App() {
  return (
    <BrowserRouter>
      <div className="app-shell">
        <nav className="navbar navbar-expand navbar-light app-navbar" aria-label="Main navigation">
          <NavLink className="navbar-brand" to="/"><span className="brand-mark">R</span><span>REACT FIELD NOTES</span></NavLink>
          <div className="navbar-nav ms-auto">
            <NavLink className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`} end to="/">Home</NavLink>
            <NavLink className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`} to="/profile">Profile</NavLink>
            <NavLink className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`} to="/shop">Shop</NavLink>
          </div>
        </nav>
        <main>
          <Routes>
            <Route path="/" element={<ErrorBoundary><HomeScreen /></ErrorBoundary>} />
            <Route path="/profile" element={<ErrorBoundary><ProfileScreen /></ErrorBoundary>} />
            <Route path="/shop" element={<ErrorBoundary><ShopScreen /></ErrorBoundary>} />
            <Route path="*" element={<ErrorBoundary><h1 className="route-screen">Page not found</h1></ErrorBoundary>} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}
export default App