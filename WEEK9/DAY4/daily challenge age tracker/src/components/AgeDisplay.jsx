export default function AgeDisplay({ age, loading }) {
  return (
    <section className={`age-display${loading ? ' is-loading' : ''}`} aria-live="polite" aria-busy={loading}>
      <p className="age-label">YOUR CURRENT AGE</p>
      <div className="age-number-wrap">
        {loading ? (
          <span className="spinner" role="status" aria-label="Updating age" />
        ) : (
          <span className="age-number">{age}</span>
        )}
        <span className="age-unit">years old</span>
      </div>
      <p className="age-caption">
        {loading ? 'One moment while we update your age…' : 'Another year, another chapter.'}
      </p>
    </section>
  )
}
