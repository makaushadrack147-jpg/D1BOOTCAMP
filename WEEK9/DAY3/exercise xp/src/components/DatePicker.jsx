import { useEffect, useState } from 'react'
import { fromDateKey, getTodayKey, toDateKey } from '../dateUtils.js'

const weekdays = ['M', 'T', 'W', 'T', 'F', 'S', 'S']

export default function DatePicker({ selectedDate, onSelectDate }) {
  const [displayedMonth, setDisplayedMonth] = useState(() => {
    const date = fromDateKey(selectedDate)
    return new Date(date.getFullYear(), date.getMonth(), 1)
  })
  const today = getTodayKey()

  useEffect(() => {
    const date = fromDateKey(selectedDate)
    setDisplayedMonth(new Date(date.getFullYear(), date.getMonth(), 1))
  }, [selectedDate])

  const monthName = new Intl.DateTimeFormat('en', {
    month: 'long',
    year: 'numeric',
  }).format(displayedMonth)
  const firstDay = (displayedMonth.getDay() + 6) % 7
  const daysInMonth = new Date(
    displayedMonth.getFullYear(),
    displayedMonth.getMonth() + 1,
    0,
  ).getDate()
  const calendarCells = Array.from({ length: 42 }, (_, index) => {
    const day = index - firstDay + 1
    if (day < 1 || day > daysInMonth) return null
    return toDateKey(new Date(displayedMonth.getFullYear(), displayedMonth.getMonth(), day))
  })

  function changeMonth(offset) {
    setDisplayedMonth((month) => new Date(month.getFullYear(), month.getMonth() + offset, 1))
  }

  return (
    <section className="calendar-card" aria-label="Choose a day">
      <div className="calendar-topline">
        <div>
          <p className="section-kicker">YOUR CALENDAR</p>
          <h2>{monthName}</h2>
        </div>
        <div className="calendar-controls">
          <button type="button" aria-label="Previous month" onClick={() => changeMonth(-1)}>‹</button>
          <button type="button" aria-label="Next month" onClick={() => changeMonth(1)}>›</button>
        </div>
      </div>

      <div className="calendar-grid calendar-weekdays" aria-hidden="true">
        {weekdays.map((day, index) => <span key={`${day}-${index}`}>{day}</span>)}
      </div>
      <div className="calendar-grid calendar-days">
        {calendarCells.map((dateKey, index) => dateKey ? (
          <button
            key={dateKey}
            className={[
              'calendar-day',
              dateKey === selectedDate ? 'is-selected' : '',
              dateKey === today ? 'is-today' : '',
            ].filter(Boolean).join(' ')}
            type="button"
            aria-label={fromDateKey(dateKey).toLocaleDateString('en', {
              weekday: 'long',
              month: 'long',
              day: 'numeric',
              year: 'numeric',
            })}
            aria-pressed={dateKey === selectedDate}
            onClick={() => onSelectDate(dateKey)}
          >
            {fromDateKey(dateKey).getDate()}
          </button>
        ) : <span className="calendar-empty" key={`empty-${index}`} />)}
      </div>

      <button className="today-button" type="button" onClick={() => onSelectDate(today)}>
        <span aria-hidden="true">↗</span> Jump to today
      </button>
    </section>
  )
}
