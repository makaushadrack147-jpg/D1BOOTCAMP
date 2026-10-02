function Input({ id, label, name, value, onChange, onBlur, error, inputMode = 'text' }) {
  const errorId = `${id}-error`

  return (
    <div className="validation-field">
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        name={name}
        type="text"
        inputMode={inputMode}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
      />
      {error && <p className="field-error" id={errorId}>{error}</p>}
    </div>
  )
}

export default Input