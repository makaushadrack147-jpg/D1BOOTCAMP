import './FormComponent.css'

const dietaryOptions = [
  { name: 'nutsFree', label: 'Nuts-free' },
  { name: 'lactoseFree', label: 'Lactose-free' },
  { name: 'vegan', label: 'Vegan' },
]

function FormComponent({ formData, onChange }) {
  const dietaryLabels = dietaryOptions
    .filter(({ name }) => formData[name] === 'on')
    .map(({ label }) => label)

  return (
    <div className="form-layout">
      <section className="form-panel" aria-labelledby="traveler-form-heading">
        <div className="panel-heading">
          <p className="panel-index">01 / DETAILS</p>
          <h2 id="traveler-form-heading">Traveler information</h2>
        </div>

        <form action="/" method="get">
          <div className="input-grid">
            <div className="field">
              <label htmlFor="firstName">First name</label>
              <input
                autoComplete="given-name"
                id="firstName"
                name="firstName"
                onChange={onChange}
                type="text"
                value={formData.firstName}
              />
            </div>

            <div className="field">
              <label htmlFor="lastName">Last name</label>
              <input
                autoComplete="family-name"
                id="lastName"
                name="lastName"
                onChange={onChange}
                type="text"
                value={formData.lastName}
              />
            </div>

            <div className="field">
              <label htmlFor="age">Age</label>
              <input
                id="age"
                min="0"
                name="age"
                onChange={onChange}
                type="number"
                value={formData.age}
              />
            </div>

            <fieldset className="field choice-field">
              <legend>Gender</legend>
              <div className="radio-options">
                {['male', 'female'].map((gender) => (
                  <label className="radio-option" htmlFor={`gender-${gender}`} key={gender}>
                    <input
                      checked={formData.gender === gender}
                      id={`gender-${gender}`}
                      name="gender"
                      onChange={onChange}
                      type="radio"
                      value={gender}
                    />
                    <span>{gender[0].toUpperCase() + gender.slice(1)}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            <div className="field field-wide">
              <label htmlFor="destination">Destination</label>
              <select
                id="destination"
                name="destination"
                onChange={onChange}
                value={formData.destination}
              >
                <option value="">Choose a destination</option>
                <option value="Japan">Japan</option>
                <option value="Thailand">Thailand</option>
                <option value="Brazil">Brazil</option>
              </select>
            </div>
          </div>

          <fieldset className="dietary-fieldset">
            <legend>Dietary requirements</legend>
            <div className="dietary-options">
              {dietaryOptions.map(({ name, label }) => (
                <label className="check-option" htmlFor={name} key={name}>
                  <input
                    checked={formData[name] === 'on'}
                    id={name}
                    name={name}
                    onChange={onChange}
                    type="checkbox"
                    value="on"
                  />
                  <span className="custom-check" aria-hidden="true" />
                  <span>{label}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <button className="submit-button" type="submit">
            Submit details <span aria-hidden="true">→</span>
          </button>
        </form>
      </section>

      <aside className="preview-panel" aria-labelledby="preview-heading" aria-live="polite">
        <div className="panel-heading preview-heading">
          <p className="panel-index">02 / LIVE PREVIEW</p>
          <h2 id="preview-heading">Your details</h2>
        </div>

        <dl className="detail-list">
          <div className="detail-row">
            <dt>First name</dt>
            <dd>{formData.firstName || <span className="empty-value">Not entered</span>}</dd>
          </div>
          <div className="detail-row">
            <dt>Last name</dt>
            <dd>{formData.lastName || <span className="empty-value">Not entered</span>}</dd>
          </div>
          <div className="detail-row">
            <dt>Age</dt>
            <dd>{formData.age || <span className="empty-value">Not entered</span>}</dd>
          </div>
          <div className="detail-row">
            <dt>Gender</dt>
            <dd>{formData.gender || <span className="empty-value">Not selected</span>}</dd>
          </div>
          <div className="detail-row">
            <dt>Destination</dt>
            <dd>{formData.destination || <span className="empty-value">Not selected</span>}</dd>
          </div>
          <div className="detail-row detail-row-last">
            <dt>Dietary</dt>
            <dd>{dietaryLabels.length ? dietaryLabels.join(', ') : <span className="empty-value">None selected</span>}</dd>
          </div>
        </dl>
      </aside>
    </div>
  )
}

export default FormComponent