import { useState } from 'react'

function Events() {
  const [isToggleOn, setIsToggleOn] = useState(true)

  const clickMe = () => window.alert('I was clicked')

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      window.alert(event.currentTarget.value)
    }
  }

  const toggleState = () => setIsToggleOn((currentValue) => !currentValue)

  return (
    <div className="demo-content event-controls">
      <button type="button" onClick={clickMe}>Click me</button>
      <label htmlFor="event-message">Press Enter to alert your text</label>
      <input
        id="event-message"
        type="text"
        placeholder="Type a message"
        onKeyDown={handleKeyDown}
      />
      <button type="button" onClick={toggleState}>
        {isToggleOn ? 'ON' : 'OFF'}
      </button>
    </div>
  )
}

export default Events