function BootstrapCard({ title, imageUrl, buttonLabel, buttonUrl, description }) {
  return (
    <div className="card m-5 gold-celebrity-card" style={{ width: '30rem' }}>
      <img className="card-img-top" src={imageUrl} alt={title} />
      <div className="card-body">
        <h5 className="card-title">{title}</h5>
        <p className="card-text">{description}</p>
        <a className="btn btn-primary" href={buttonUrl}>
          {buttonLabel}
        </a>
      </div>
    </div>
  )
}

export default BootstrapCard