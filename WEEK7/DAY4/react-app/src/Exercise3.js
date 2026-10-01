import { Component } from 'react'
import './Exercise.css'

class Exercise extends Component {
  render() {
    const style_header = {
      color: 'white',
      backgroundColor: 'DodgerBlue',
      padding: '10px',
      fontFamily: 'Arial',
    }

    return (
      <div className="tag-demo">
        <h1 style={style_header}>This is a heading</h1>
        <p className="para">This is a paragraph styled with a separate CSS file.</p>
        <a href="https://react.dev/" target="_blank" rel="noreferrer">
          Visit React.dev
        </a>
        <form className="demo-form" onSubmit={(event) => event.preventDefault()}>
          <label htmlFor="visitor-name">Your name</label>
          <input id="visitor-name" name="name" placeholder="Enter your name" />
          <button type="submit">Submit</button>
        </form>
        <img
          className="demo-image"
          src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1000&q=85"
          alt="Sunlit mountain landscape"
        />
        <ul className="demo-list">
          <li>Learn</li>
          <li>Build</li>
          <li>Repeat</li>
        </ul>
      </div>
    )
  }
}

export default Exercise