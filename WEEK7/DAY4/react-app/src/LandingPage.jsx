import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowDown, faArrowRight } from '@fortawesome/free-solid-svg-icons'
import Card from './Card.jsx'
import Contact from './Contact.jsx'
import Header from './Header.jsx'

const destinations = [
  {
    number: '01',
    name: 'Japan, in good company',
    region: 'Japan · 10 days',
    image:
      'https://res.klook.com/image/upload/fl_lossy.progressive,q_65/c_fill,w_480,h_384/cities/e8fnw35p6zgusq218foj.webp',
    imageAlt: 'City lights and streets in Japan',
    description: 'Quiet mornings, late-night ramen, and the beautiful in-between.',
    link: 'https://www.japan.travel/en/',
  },
  {
    number: '02',
    name: 'Hong Kong, after hours',
    region: 'Hong Kong · 6 days',
    image:
      'https://res.klook.com/image/upload/fl_lossy.progressive,q_65/c_fill,w_480,h_384/cities/jrfyzvgzvhs1iylduuhj.jpg',
    imageAlt: 'A view of Hong Kong',
    description: 'Harbour air, hillside walks, and a table full of small plates.',
    link: 'https://www.discoverhongkong.com/',
  },
  {
    number: '03',
    name: 'Macao, beyond the lights',
    region: 'Macao · 5 days',
    image:
      'https://res.klook.com/image/upload/fl_lossy.progressive,q_65/c_fill,w_480,h_384/cities/c1cklkyp6ms02tougufx.webp',
    imageAlt: 'Historic architecture in Macao',
    description: 'A slower side of the city, shaped by old lanes and sea breezes.',
    link: 'https://www.macaotourism.gov.mo/en/',
  },
]

function LandingPage() {
  return (
    <div className="landing-page" id="home">
      <Header />
      <main>
        <section className="landing-hero" aria-labelledby="hero-title">
          <img
            className="landing-hero-image"
            src="https://res.klook.com/image/upload/fl_lossy.progressive,q_65/c_fill,w_480,h_384/cities/jrfyzvgzvhs1iylduuhj.jpg"
            alt="Hong Kong rising above the harbour"
          />
          <div className="landing-hero-shade" />
          <div className="container landing-hero-content">
            <p className="hero-kicker">SMALL-GROUP TRIPS, BIG-OPEN-WINDOW ENERGY</p>
            <h1 id="hero-title">Take the<br />scenic route.</h1>
            <div className="hero-bottom-row">
              <p>Thoughtful journeys for people who want to feel a place, not just see it.</p>
              <a className="hero-cta" href="#destinations">
                Find your somewhere
                <FontAwesomeIcon icon={faArrowRight} aria-hidden="true" />
              </a>
            </div>
          </div>
          <a className="hero-scroll" href="#destinations">
            <FontAwesomeIcon icon={faArrowDown} aria-hidden="true" />
            <span>SCROLL TO WANDER</span>
          </a>
          <p className="hero-image-note">22° 17' N · 114° 10' E</p>
        </section>

        <section className="destination-section" id="destinations" aria-labelledby="destinations-title">
          <div className="container">
            <div className="section-heading" id="about">
              <div>
                <p className="section-kicker">GOOD PLACES. BETTER STORIES.</p>
                <h2 id="destinations-title">A few ways to get lost.</h2>
              </div>
              <p className="section-intro">
                Small groups, local guides, and just enough of a plan to leave room for the unexpected.
              </p>
            </div>
            <div className="row g-4 destination-grid">
              {destinations.map((destination) => (
                <div className="col-12 col-md-6 col-lg-4" key={destination.number}>
                  <Card destination={destination} />
                </div>
              ))}
            </div>
            <a className="all-trips-link" href="#contact">
              Ask us about all trips <FontAwesomeIcon icon={faArrowRight} aria-hidden="true" />
            </a>
          </div>
        </section>
        <Contact />
      </main>
    </div>
  )
}

export default LandingPage