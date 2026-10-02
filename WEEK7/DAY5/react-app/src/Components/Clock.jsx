import { useEffect, useState } from 'react'

function Clock() {
  const [currentDate, setCurrentDate] = useState(new Date())

  const tick = () => {
    setCurrentDate(new Date())
  }

  useEffect(() => {
    const intervalId = window.setInterval(tick, 1000)
    return () => window.clearInterval(intervalId)
  }, [])

  return (
    <div className="clock-display">
      <time dateTime={currentDate.toISOString()}>{currentDate.toLocaleTimeString()}</time>
      <p>{currentDate.toLocaleDateString()}</p>
    </div>
  )
}

export default Clock