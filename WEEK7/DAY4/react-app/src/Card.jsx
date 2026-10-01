import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowUpRightFromSquare, faLocationDot } from '@fortawesome/free-solid-svg-icons'

function Card({ destination }) {
  return (
    <article className="destination-card">
      <a className="destination-card-image" href={destination.link} aria-label={`Explore ${destination.name}`}>
        <img src={destination.image} alt={destination.imageAlt} loading="lazy" />
        <span className="destination-number">{destination.number}</span>
      </a>
      <div className="destination-card-copy">
        <p className="destination-region">
          <FontAwesomeIcon icon={faLocationDot} aria-hidden="true" />
          {destination.region}
        </p>
        <h3>{destination.name}</h3>
        <p>{destination.description}</p>
        <a className="destination-link" href={destination.link}>
          Explore trip <FontAwesomeIcon icon={faArrowUpRightFromSquare} aria-hidden="true" />
        </a>
      </div>
    </article>
  )
}

export default Card