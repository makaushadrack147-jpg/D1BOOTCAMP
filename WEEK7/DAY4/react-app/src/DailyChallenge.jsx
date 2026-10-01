import { Carousel } from 'react-responsive-carousel'
import 'react-responsive-carousel/lib/styles/carousel.min.css'

const destinations = [
  {
    name: 'Hong Kong',
    image:
      'https://res.klook.com/image/upload/fl_lossy.progressive,q_65/c_fill,w_480,h_384/cities/jrfyzvgzvhs1iylduuhj.jpg',
  },
  {
    name: 'Macao',
    image:
      'https://res.klook.com/image/upload/fl_lossy.progressive,q_65/c_fill,w_480,h_384/cities/c1cklkyp6ms02tougufx.webp',
  },
  {
    name: 'Japan',
    image:
      'https://res.klook.com/image/upload/fl_lossy.progressive,q_65/c_fill,w_480,h_384/cities/e8fnw35p6zgusq218foj.webp',
  },
  {
    name: 'Las Vegas',
    image:
      'https://res.klook.com/image/upload/fl_lossy.progressive,q_65/c_fill,w_480,h_384/cities/liw377az16sxmp9a6ylg.webp',
  },
]

function DailyChallenge() {
  return (
    <section className="carousel-section container" aria-labelledby="carousel-title">
      <div className="row justify-content-center">
        <div className="col-12 col-lg-10">
          <p className="eyebrow">EXPLORE THE WORLD</p>
          <h1 id="carousel-title">Choose your next destination</h1>
          <div className="destination-carousel">
            <Carousel
              ariaLabel="Featured travel destinations"
              autoPlay
              infiniteLoop
              interval={5000}
              showStatus={false}
              showThumbs={false}
              stopOnHover
              useKeyboardArrows
            >
              {destinations.map((destination) => (
                <div className="destination-slide" key={destination.name}>
                  <img src={destination.image} alt={destination.name} />
                  <div className="destination-caption">
                    <h2>{destination.name}</h2>
                  </div>
                </div>
              ))}
            </Carousel>
          </div>
        </div>
      </div>
    </section>
  )
}

export default DailyChallenge