export default function AgeControls({ age, loading, onAgeUp, onAgeDown }) {
  function handleSubmit(event) {
    event.preventDefault()
    onAgeUp()
  }

  return (
    <form className="age-controls" onSubmit={handleSubmit}>
      <p className="controls-label">MAKE AN UPDATE</p>
      <div className="button-row">
        <button className="age-button age-down" type="button" onClick={onAgeDown} disabled={loading || age === 0}>
          <span className="button-icon" aria-hidden="true">−</span>
          <span>Age Down</span>
        </button>
        <button className="age-button age-up" type="submit" disabled={loading}>
          <span className="button-icon" aria-hidden="true">+</span>
          <span>Age Up</span>
        </button>
      </div>
      <p className="control-hint">Each update is processed asynchronously.</p>
    </form>
  )
}
