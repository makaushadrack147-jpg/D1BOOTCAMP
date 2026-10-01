import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight, faCompass } from '@fortawesome/free-solid-svg-icons'

function Header() {
  return (
    <header className="site-header">
      <nav className="navbar container-fluid px-4 px-lg-5" aria-label="Main navigation">
        <a className="site-brand" href="#home" aria-label="Fieldtrip home">
          <FontAwesomeIcon icon={faCompass} aria-hidden="true" />
          <span>FIELDTRIP</span>
        </a>
        <div className="site-nav-links">
          <a href="#destinations">Destinations</a>
          <a href="#about">Our approach</a>
          <a className="nav-contact" href="#contact">
            Contact <FontAwesomeIcon icon={faArrowRight} aria-hidden="true" />
          </a>
        </div>
      </nav>
    </header>
  )
}

export default Header