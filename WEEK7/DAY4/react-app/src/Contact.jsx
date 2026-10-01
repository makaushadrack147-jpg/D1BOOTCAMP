import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight, faEnvelope } from '@fortawesome/free-solid-svg-icons'

function Contact() {
  return (
    <section className="contact-section" id="contact" aria-labelledby="contact-title">
      <div className="container contact-inner">
        <div>
          <p className="section-kicker">THE FIRST STEP IS A HELLO</p>
          <h2 id="contact-title">Where do you want to wake up?</h2>
        </div>
        <div className="contact-action">
          <p>Tell us what you’re dreaming about. We’ll help you find a way there.</p>
          <a className="contact-link" href="mailto:hello@fieldtrip.travel">
            <FontAwesomeIcon icon={faEnvelope} aria-hidden="true" />
            hello@fieldtrip.travel
            <FontAwesomeIcon icon={faArrowRight} aria-hidden="true" />
          </a>
        </div>
      </div>
      <div className="container contact-footer">
        <a className="site-brand site-brand-light" href="#home">
          <span>FIELDTRIP</span>
        </a>
        <p>Take the long way. © 2026 Fieldtrip Travel</p>
      </div>
    </section>
  )
}

export default Contact