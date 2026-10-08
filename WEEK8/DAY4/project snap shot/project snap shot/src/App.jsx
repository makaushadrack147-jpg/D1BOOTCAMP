import { useEffect, useState } from 'react'
import { Link, NavLink, Navigate, Route, Routes, useNavigate, useParams } from 'react-router-dom'
import { getPreviewImages } from './images.js'

const categories = [
  { label: 'Mountain', slug: 'mountain', icon: '⌁' },
  { label: 'Beaches', slug: 'beaches', icon: '≈' },
  { label: 'Birds', slug: 'birds', icon: '↗' },
  { label: 'Food', slug: 'food', icon: '◌' },
]

function SearchBar() {
  const navigate = useNavigate()
  const [value, setValue] = useState('')

  function handleSubmit(event) {
    event.preventDefault()
    const query = value.trim()
    if (query) navigate(`/search/${encodeURIComponent(query)}`)
  }

  return (
    <form className="search-form" onSubmit={handleSubmit} role="search">
      <span className="search-icon" aria-hidden="true">⌕</span>
      <input
        aria-label="Search photos"
        onChange={(event) => setValue(event.target.value)}
        placeholder="Search for photos..."
        value={value}
      />
      {value && (
        <button className="search-clear" onClick={() => setValue('')} type="button" aria-label="Clear search">
          ×
        </button>
      )}
      <button className="search-submit" type="submit" aria-label="Search">Search</button>
    </form>
  )
}

function Header() {
  return (
    <header className="site-header">
      <Link className="brand" to="/mountain" aria-label="Snap Shot home">
        <span className="brand-mark" aria-hidden="true"><i /><i /><i /><i /></span>
        <span>snap<span className="brand-light">shot</span></span>
      </Link>
      <nav className="category-nav" aria-label="Photo categories">
        {categories.map((category) => (
          <NavLink
            className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
            key={category.slug}
            to={`/${category.slug}`}
          >
            <span className="nav-icon" aria-hidden="true">{category.icon}</span>
            {category.label}
          </NavLink>
        ))}
      </nav>
      <a className="header-note" href="#gallery">A little inspiration, daily <span aria-hidden="true">↗</span></a>
    </header>
  )
}

function PhotoCard({ photo, index }) {
  const [imageLoaded, setImageLoaded] = useState(false)
  return (
    <article className={`photo-card${imageLoaded ? ' image-loaded' : ''}`} style={{ '--card-order': index }}>
      <div className="photo-frame" style={{ aspectRatio: `4 / ${Math.max(3, photo.height / 100)}` }}>
        <img
          alt={photo.alt}
          loading="lazy"
          onLoad={() => setImageLoaded(true)}
          src={photo.src}
        />
        <div className="photo-overlay">
          <span className="photo-title">{photo.title}</span>
          <span className="photo-credit">Photo by {photo.photographer}</span>
        </div>
      </div>
    </article>
  )
}

function GalleryPage({ search = false }) {
  const { category, query: routeQuery } = useParams()
  const title = search ? decodeURIComponent(routeQuery || '') : category || 'mountain'
  const [photos, setPhotos] = useState([])
  const [totalPages, setTotalPages] = useState(1)
  const [page, setPage] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [isPreview, setIsPreview] = useState(false)
  const apiKey = import.meta.env.VITE_PEXELS_API_KEY
  const displayTitle = title.charAt(0).toUpperCase() + title.slice(1)

  useEffect(() => {
    setPage(1)
  }, [title])

  useEffect(() => {
    const controller = new AbortController()

    async function loadPhotos() {
      setIsLoading(true)
      setError('')

      if (!apiKey) {
        const preview = getPreviewImages(title).map((photo) => ({
          ...photo,
          src: `${photo.src}&ixlib=rb-4.1.0`,
        }))
        setPhotos(preview)
        setTotalPages(1)
        setIsPreview(true)
        setIsLoading(false)
        return
      }

      try {
        const response = await fetch(
          `https://api.pexels.com/v1/search?query=${encodeURIComponent(title)}&per_page=30&page=${page}`,
          {
            headers: { Authorization: apiKey },
            signal: controller.signal,
          },
        )

        if (!response.ok) {
          throw new Error(`Pexels request failed (${response.status}). Check your API key and try again.`)
        }

        const result = await response.json()
        setPhotos(result.photos.map((photo) => ({
          id: photo.id,
          title: photo.alt || `${title} photo`,
          photographer: photo.photographer,
          alt: photo.alt || `${title} photograph by ${photo.photographer}`,
          src: photo.src.large,
        })))
        setTotalPages(Math.max(1, Math.ceil(result.total_results / 30)))
        setIsPreview(false)
      } catch (requestError) {
        if (requestError.name !== 'AbortError') {
          setError(requestError.message || 'Photos could not be loaded. Please try again.')
          setPhotos([])
        }
      } finally {
        if (!controller.signal.aborted) setIsLoading(false)
      }
    }

    loadPhotos()
    return () => controller.abort()
  }, [apiKey, page, title])

  return (
    <main className="main-content" id="gallery">
      <section className="gallery-heading">
        <div>
          <p className="eyebrow">{search ? 'YOUR SEARCH' : 'CURATED FOR YOU'}</p>
          <h1>{search ? <>Photos of <span>{displayTitle}</span></> : <>{displayTitle}<span className="heading-period">.</span></>}</h1>
          <p className="heading-subtitle">
            {search ? `A collection inspired by “${title}”.` : `Find a fresh perspective on ${title.toLowerCase()}.`}
          </p>
        </div>
        <div className="heading-decoration" aria-hidden="true">
          <span>✳</span>
          <span>GOOD THINGS<br />CATCH YOUR EYE</span>
        </div>
      </section>

      {isPreview && (
        <p className="preview-notice">
          <span aria-hidden="true">✦</span>
          Previewing a hand-picked collection. Add a Pexels API key to explore more photos.
        </p>
      )}

      {error && <p className="error-notice" role="alert">{error}</p>}

      {isLoading ? (
        <div className="loading-state" role="status"><span className="loader" />Finding beautiful photos...</div>
      ) : photos.length ? (
        <>
          <section className="photo-grid" aria-label={`${displayTitle} photos`}>
            {photos.map((photo, index) => <PhotoCard key={photo.id} photo={photo} index={index} />)}
          </section>
          {totalPages > 1 && (
            <nav className="pagination" aria-label="Gallery pages">
              <button disabled={page <= 1} onClick={() => setPage((current) => current - 1)} type="button">
                <span aria-hidden="true">←</span> Previous
              </button>
              <span>Page <strong>{page}</strong> of {totalPages}</span>
              <button disabled={page >= totalPages} onClick={() => setPage((current) => current + 1)} type="button">
                Next <span aria-hidden="true">→</span>
              </button>
            </nav>
          )}
        </>
      ) : (
        <div className="empty-state">
          <span aria-hidden="true">✳</span>
          <h2>No photos found just yet</h2>
          <p>Try another search, or browse one of our collections.</p>
        </div>
      )}
    </main>
  )
}

function App() {
  return (
    <div className="app-shell">
      <Header />
      <section className="intro-bar">
        <span className="intro-spark" aria-hidden="true">✳</span>
        <p>Collect moments. Find your point of view.</p>
        <SearchBar />
      </section>
      <Routes>
        <Route path="/" element={<Navigate to="/mountain" replace />} />
        <Route path="/search/:query" element={<GalleryPage search />} />
        {categories.map(({ slug }) => (
          <Route element={<GalleryPage />} key={slug} path={`/${slug}`} />
        ))}
        <Route path="*" element={<Navigate to="/mountain" replace />} />
      </Routes>
      <footer className="site-footer">
        <Link className="footer-brand" to="/mountain">snap<span>shot</span></Link>
        <span>Made for the love of looking.</span>
        <a href="#top" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>Back to top ↑</a>
      </footer>
    </div>
  )
}

export default App
