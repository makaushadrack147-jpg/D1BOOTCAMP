import React, { useEffect, useState } from 'react'
import homeRepairsImage from './home-repairs-photo.png'
import designPhoto from './design-photo.jpg'
import digitalPhoto from './digital-photo.jpg'
import beautyPhoto from './beauty-photo.jpg'
import foodPhoto from './food-photo.jpg'
import learningPhoto from './learning-photo.jpg'
import servicePhotoRecords from './service-photo-credits.json'
import { serviceGuide } from './data.js'
import { apiUrl } from './api.js'

const categories = [
  { name: 'Home & repairs', summary: 'Plumbers, painters, carpenters and more', image: homeRepairsImage, tone: 'peach', isLogo: true },
  { name: 'Design & creative', summary: 'Branding, interiors, styling and visuals', image: designPhoto, tone: 'lilac' },
  { name: 'Digital & tech', summary: 'Web, support, automation and setup', image: digitalPhoto, tone: 'blue' },
  { name: 'Beauty & wellness', summary: 'Spa, grooming and personal care', image: beautyPhoto, tone: 'pink' },
  { name: 'Food & events', summary: 'Catering, hosting and event support', image: foodPhoto, tone: 'yellow' },
  { name: 'Learning & skills', summary: 'Tutors, coaches and workshops', image: learningPhoto, tone: 'mint' },
]

const categoryVisuals = Object.fromEntries(
  categories.map(({ name, image, tone }) => [name, { image, tone }]),
)

const servicePhotoCredits = Object.fromEntries(
  servicePhotoRecords.map((photo) => [photo.key, photo]),
)

const bookingPhotoAliases = {
  'Plumbing': 'home-repairs-plumbing-repairs',
  'Electrical repairs': 'home-repairs-electrical-repairs',
  'Painting': 'home-repairs-house-painting',
  'Appliance repair': 'category:Digital & tech',
  'House cleaning': 'home-repairs-house-cleaning',
  'Carpentry': 'home-repairs-carpenter-services',
  'Masonry': 'home-repairs-tiling',
  'Pest control': 'home-repairs-gardening',
  'Handyman': 'home-repairs-furniture-assembly',
  'Locksmith': 'home-repairs-locksmith',
  'Moving and furniture transport': 'home-repairs-moving-boxes',
  'Roofing repairs': 'category:Home & repairs',
  'Logo design': 'design-creative-logo-design',
  'Posters and flyers': 'design-creative-poster-flyer-design',
  'Social media design': 'design-creative-social-media-graphics',
  'Photography': 'design-creative-photography-session',
  'Video editing': 'design-creative-video-editing',
  'Website design': 'design-creative-business-card-design',
  'Business branding': 'design-creative-brand-identity-package',
  'CV design': 'design-creative-cv-design',
  'Technical documentation': 'digital-tech-basic-it-support',
  'Cloud services setup': 'digital-tech-software-installation',
  'Excel and spreadsheet automation': 'digital-tech-data-entry',
  'Computer lessons': 'digital-tech-computer-troubleshooting',
  'Domain and hosting setup': 'digital-tech-website-development',
  'Website maintenance': 'digital-tech-website-maintenance',
  'E-commerce website setup': 'digital-tech-seo-services',
  'Mobile app development': 'digital-tech-social-media-management',
  'Spa package': 'beauty-wellness-massage-session',
  'Group fitness class': 'category:Beauty & wellness',
  'Home-visit hairstyling': 'beauty-wellness-hair-styling',
  'Waxing': 'beauty-wellness-pedicure',
  'Henna application': 'beauty-wellness-manicure',
  'Bridal beauty package': 'beauty-wellness-makeup-application',
  'Wig installation': 'beauty-wellness-braiding',
  'Dreadlocks maintenance': 'beauty-wellness-haircut',
  'Shampoo and blow-dry': 'beauty-wellness-facial-treatment',
  'Popcorn and candy-floss station': 'food-events-popcorn',
  'Event cleanup': 'food-events-waiter-services',
  'Sound system rental': 'food-events-tent-and-chair-setup',
  'Invitation card design': 'food-events-event-photography',
  'Florist and flower arrangements': 'food-events-event-decoration',
  'MC and event hosting': 'food-events-event-planning',
  'Wedding coordination': 'category:Food & events',
  'Cocktail and mocktail service': 'food-events-catering-per-person',
  'Meal delivery for small events': 'food-events-private-chef',
  'Snacks and finger foods': 'food-events-birthday-cake',
  'Handcrafts and DIY training': 'learning-skills-business-skills-training',
  'Chess lessons': 'learning-skills-chess-lessons',
  'Basic bookkeeping lessons': 'learning-skills-mathematics-tutoring',
  'CV and portfolio workshop': 'learning-skills-photography-lessons',
  'Financial literacy training': 'category:Learning & skills',
  'Driving theory tutoring': 'learning-skills-computer-lessons',
  'Cooking classes': 'learning-skills-music-lessons',
  'Video editing lessons': 'learning-skills-coding-lessons',
  'Digital marketing training': 'learning-skills-language-lessons',
  'Public speaking and communication': 'learning-skills-english-tutoring',
}

const highlights = [
  { value: '12k+', label: 'trusted professionals' },
  { value: '4.9/5', label: 'average client rating' },
  { value: '24/7', label: 'booking support' },
]

const featuredServices = [
  'Interior painting',
  'Website setup',
  'Event photography',
  'Meal prep plans',
  'Home organization',
  'Private tutoring',
]

function guideServiceKey(category, title) {
  return `${category}-${title}`
    .normalize('NFKD')
    .toLowerCase()
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

function assignBookingPhotos(services) {
  const usedPhotos = new Set()
  const usedCategoryPhotos = new Set()

  return services.map((service) => {
    const alias = bookingPhotoAliases[service.title] || guideServiceKey(service.category, service.title)
    const categoryName = alias.startsWith('category:') ? alias.slice('category:'.length) : service.category
    const categoryKey = `category:${categoryName}`
    let photo = alias.startsWith('category:') ? null : servicePhotoCredits[alias]

    if (photo && usedPhotos.has(photo.key)) photo = null
    if (!photo && !alias.startsWith('category:')) {
      const categoryPrefix = `${guideServiceKey(service.category, '').replace(/-$/, '')}-`
      photo = servicePhotoRecords.find((record) =>
        record.key.startsWith(categoryPrefix) && !usedPhotos.has(record.key),
      )
    }

    if (photo) {
      usedPhotos.add(photo.key)
      return {
        ...service,
        bookingPhoto: {
          src: `${import.meta.env.BASE_URL}service-photos/${photo.fileName}`,
          credit: photo,
        },
      }
    }

    const categoryPhoto = categoryVisuals[categoryName]
    if (!categoryPhoto || usedCategoryPhotos.has(categoryKey)) {
      throw new Error(`A unique booking photo is not available for ${service.title}.`)
    }
    usedCategoryPhotos.add(categoryKey)
    return {
      ...service,
      bookingPhoto: { src: categoryPhoto.image, credit: null },
    }
  })
}

function formatPaymentDate(date) {
  const parsedDate = new Date(date)
  return Number.isNaN(parsedDate.getTime())
    ? 'Date unavailable'
    : parsedDate.toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' })
}

function App() {
  const [navigationOpen, setNavigationOpen] = useState(false)
  const [selectedGuideCategory, setSelectedGuideCategory] = useState(categories[0].name)
  const [guidePhotos, setGuidePhotos] = useState({})
  const [guidePhotoError, setGuidePhotoError] = useState('')
  const [guidePhotoMessage, setGuidePhotoMessage] = useState('')
  const [guidePhotoSaving, setGuidePhotoSaving] = useState({})
  const [serviceListings, setServiceListings] = useState([])
  const [serviceListingsLoading, setServiceListingsLoading] = useState(true)
  const [serviceListingsError, setServiceListingsError] = useState('')
  const [serviceSearch, setServiceSearch] = useState('')
  const [serviceCategory, setServiceCategory] = useState('All services')
  const [orderNotice, setOrderNotice] = useState('')
  const [orderSuccess, setOrderSuccess] = useState('')
  const [selectedOrderService, setSelectedOrderService] = useState(null)
  const [orderLocation, setOrderLocation] = useState('')
  const [orderDate, setOrderDate] = useState('')
  const [orderDetails, setOrderDetails] = useState('')
  const [orderError, setOrderError] = useState('')
  const [orderSaving, setOrderSaving] = useState(false)
  const [authUser, setAuthUser] = useState(null)
  const [walletTransactions, setWalletTransactions] = useState([])
  const [walletSummary, setWalletSummary] = useState(null)
  const [walletLoading, setWalletLoading] = useState(false)
  const [walletError, setWalletError] = useState('')
  const [authOpen, setAuthOpen] = useState(false)
  const [authMode, setAuthMode] = useState('signin')
  const [authName, setAuthName] = useState('')
  const [authEmail, setAuthEmail] = useState('')
  const [authPassword, setAuthPassword] = useState('')
  const [authConfirmPassword, setAuthConfirmPassword] = useState('')
  const [authRole, setAuthRole] = useState('customer')
  const [authError, setAuthError] = useState('')
  const [authMessage, setAuthMessage] = useState('')
  const [authLoading, setAuthLoading] = useState(false)
  const [resetToken, setResetToken] = useState('')
  const today = new Date().toISOString().slice(0, 10)

  const filteredServices = serviceListings.filter((service) => {
    const matchesCategory = serviceCategory === 'All services' || service.category === serviceCategory
    const query = serviceSearch.trim().toLowerCase()
    const matchesSearch = !query ||
      [service.title, service.description, service.provider_name, service.location, service.category]
        .some((value) => value?.toLowerCase().includes(query))
    return matchesCategory && matchesSearch
  })

  function openAuth(mode) {
    setAuthMode(mode)
    setAuthError('')
    setAuthMessage('')
    setAuthPassword('')
    setAuthConfirmPassword('')
    setAuthOpen(true)
  }

  useEffect(() => {
    const controller = new AbortController()
    const token = new URLSearchParams(window.location.hash.slice(1)).get('resetToken') ||
      new URLSearchParams(window.location.search).get('resetToken')
    if (token) {
      setResetToken(token)
      setAuthMode('reset')
      setAuthOpen(true)
    }

    async function loadGuidePhotos() {
      try {
        const response = await fetch(apiUrl('/api/common-service-photos'), {
          signal: controller.signal,
        })
        if (!response.ok) throw new Error('Custom service photos could not be loaded.')

        const photos = await response.json()
        if (!Array.isArray(photos)) throw new Error('Custom service photos could not be loaded.')
        setGuidePhotos(Object.fromEntries(photos.map((photo) => [photo.service_key, photo])))
      } catch (error) {
        if (!controller.signal.aborted) {
          setGuidePhotoError(error instanceof Error ? error.message : 'Custom service photos could not be loaded.')
        }
      }

      try {
        const response = await fetch(apiUrl('/api/auth/me'), {
          credentials: 'include',
          signal: controller.signal,
        })
        if (response.status === 401) return
        if (!response.ok) throw new Error('Administrator access could not be checked.')

        const result = await response.json()
        if (result.user && !controller.signal.aborted) setAuthUser(result.user)
      } catch (error) {
        if (!controller.signal.aborted) {
          setGuidePhotoError(error instanceof Error ? error.message : 'Administrator access could not be checked.')
        }
      }
    }

    async function loadServices() {
      try {
        const response = await fetch(apiUrl('/api/services'), { signal: controller.signal })
        if (!response.ok) throw new Error('Available services could not be loaded.')

        const services = await response.json()
        if (!Array.isArray(services)) throw new Error('Available services could not be loaded.')
        if (!controller.signal.aborted) {
          setServiceListings(assignBookingPhotos(services.filter((service) => service.provider_user_id != null)))
        }
      } catch (error) {
        if (!controller.signal.aborted) {
          setServiceListingsError(error instanceof Error ? error.message : 'Available services could not be loaded.')
        }
      } finally {
        if (!controller.signal.aborted) setServiceListingsLoading(false)
      }
    }

    loadGuidePhotos()
    loadServices()
    return () => controller.abort()
  }, [])

  useEffect(() => {
    const controller = new AbortController()
    if (authUser?.role !== 'customer') {
      setWalletTransactions([])
      setWalletSummary(null)
      setWalletLoading(false)
      setWalletError('')
      return () => controller.abort()
    }

    async function loadWalletRequests() {
      setWalletLoading(true)
      setWalletError('')
      try {
        const response = await fetch(apiUrl('/api/wallet'), {
          credentials: 'include',
          signal: controller.signal,
        })
        if (response.status === 401) throw new Error('Your session expired. Sign in again to view your wallet.')
        if (!response.ok) throw new Error('Your wallet history could not be loaded.')

        const result = await response.json()
        if (!Array.isArray(result.transactions) || !Number.isFinite(Number(result.total_paid))) {
          throw new Error('Your wallet history could not be loaded.')
        }
        if (!controller.signal.aborted) {
          setWalletTransactions(result.transactions)
          setWalletSummary(result)
        }
      } catch (error) {
        if (!controller.signal.aborted) {
          setWalletError(error instanceof Error ? error.message : 'Your wallet history could not be loaded.')
        }
      } finally {
        if (!controller.signal.aborted) setWalletLoading(false)
      }
    }

    loadWalletRequests()
    return () => controller.abort()
  }, [authUser])

  async function handleAuthSubmit(event) {
    event.preventDefault()
    setAuthError('')
    setAuthMessage('')
    setAuthLoading(true)
    try {
      if (authMode === 'signup' && authPassword !== authConfirmPassword) {
        throw new Error('Your passwords do not match.')
      }

      const registering = authMode === 'signup'
      const response = await fetch(apiUrl(registering ? '/api/auth/register' : '/api/auth/login'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(registering
          ? { name: authName, email: authEmail, password: authPassword, role: authRole }
          : { email: authEmail, password: authPassword }),
      })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error || (registering ? 'Account creation failed.' : 'Sign in failed.'))
      if (authMode === 'admin' && result.user?.role !== 'admin') {
        await fetch(apiUrl('/api/auth/logout'), { method: 'POST', credentials: 'include' })
        throw new Error('This account does not have administrator access. Use the email configured as ADMIN_EMAIL for the backend.')
      }

      setAuthUser(result.user)
      if (selectedOrderService && result.user?.role !== 'customer') {
        setSelectedOrderService(null)
        setOrderNotice('Service bookings require a customer account. Sign in with a customer account to continue.')
      } else {
        setOrderNotice('')
      }
      setAuthPassword('')
      setAuthConfirmPassword('')
      setAuthOpen(false)
    } catch (error) {
      setAuthError(error instanceof Error ? error.message : 'Authentication failed.')
    } finally {
      setAuthLoading(false)
    }
  }

  function handleOrderService(service) {
    setOrderNotice('')
    setOrderSuccess('')
    setOrderError('')
    setOrderLocation('')
    setOrderDate('')
    setOrderDetails('')
    if (authUser && authUser.role !== 'customer') {
      setOrderNotice('Service bookings require a customer account. Sign in with a customer account to continue.')
      return
    }
    setSelectedOrderService(service)
    if (!authUser) openAuth('signin')
  }

  async function handleServiceOrderSubmit(event) {
    event.preventDefault()
    if (!selectedOrderService) return

    setOrderError('')
    setOrderSaving(true)
    try {
      const response = await fetch(apiUrl('/api/requests'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          service_id: selectedOrderService.id,
          location: orderLocation,
          preferred_date: orderDate,
          details: orderDetails,
        }),
      })
      const result = await response.json()
      if (!response.ok) {
        if (response.status === 401) {
          setAuthUser(null)
          openAuth('signin')
          throw new Error('Your session expired. Sign in again to place your request.')
        }
        throw new Error(result.error || 'Your service request could not be sent.')
      }

      setSelectedOrderService(null)
      setOrderSuccess(`Your request for ${selectedOrderService.title} was sent to ${selectedOrderService.provider_name}.`)
    } catch (error) {
      setOrderError(error instanceof Error ? error.message : 'Your service request could not be sent.')
    } finally {
      setOrderSaving(false)
    }
  }

  async function handleForgotPasswordSubmit(event) {
    event.preventDefault()
    setAuthError('')
    setAuthMessage('')
    setAuthLoading(true)
    try {
      const response = await fetch(apiUrl('/api/auth/forgot-password'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: authEmail }),
      })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error || 'Password reset could not be requested.')
      setAuthMessage(result.message)
    } catch (error) {
      setAuthError(error instanceof Error ? error.message : 'Password reset could not be requested.')
    } finally {
      setAuthLoading(false)
    }
  }

  async function handleResetPasswordSubmit(event) {
    event.preventDefault()
    setAuthError('')
    setAuthMessage('')
    if (authPassword !== authConfirmPassword) {
      setAuthError('Your passwords do not match.')
      return
    }

    setAuthLoading(true)
    try {
      const response = await fetch(apiUrl('/api/auth/reset-password'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: resetToken, password: authPassword }),
      })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error || 'Password could not be reset.')
      window.history.replaceState({}, '', `${window.location.pathname}${window.location.search}`)
      setResetToken('')
      setAuthPassword('')
      setAuthConfirmPassword('')
      setAuthMode('signin')
      setAuthMessage(result.message)
    } catch (error) {
      setAuthError(error instanceof Error ? error.message : 'Password could not be reset.')
    } finally {
      setAuthLoading(false)
    }
  }

  async function handleLogout() {
    setGuidePhotoError('')
    try {
      const response = await fetch(apiUrl('/api/auth/logout'), {
        method: 'POST',
        credentials: 'include',
      })
      if (!response.ok) {
        const result = await response.json()
        throw new Error(result.error || 'Sign out failed.')
      }
      setAuthUser(null)
    } catch (error) {
      setGuidePhotoError(error instanceof Error ? error.message : 'Sign out failed.')
    }
  }

  async function handleGuidePhotoUpload(event, serviceKey, serviceTitle) {
    const input = event.currentTarget
    const file = input.files?.[0]
    input.value = ''
    if (!file) return

    setGuidePhotoError('')
    setGuidePhotoMessage('')
    setGuidePhotoSaving((current) => ({ ...current, [serviceKey]: true }))
    try {
      const response = await fetch(apiUrl(`/api/common-service-photos/${serviceKey}/photo`), {
        method: 'PUT',
        headers: { 'Content-Type': file.type },
        credentials: 'include',
        body: file,
      })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error || `The ${serviceTitle} photo could not be uploaded.`)

      setGuidePhotos((current) => ({ ...current, [serviceKey]: result }))
      setGuidePhotoMessage(`${serviceTitle} photo updated.`)
    } catch (error) {
      setGuidePhotoError(error instanceof Error ? error.message : `The ${serviceTitle} photo could not be uploaded.`)
    } finally {
      setGuidePhotoSaving((current) => ({ ...current, [serviceKey]: false }))
    }
  }

  return (
    <div className="app-shell">
      <header className="topbar home-topbar">
        <div className="brand" aria-label="Hustle Hub Kenya brand">
          <img className="brand-mark" src={`${import.meta.env.BASE_URL}hustle-hub-logo.svg`} alt="" />
          <span>
            Hustle Hub<span className="brand-light"> Kenya</span>
            <small>LOCAL TALENT</small>
          </span>
        </div>

        <button
          className="nav-toggle"
          type="button"
          aria-label={navigationOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={navigationOpen}
          aria-controls="site-navigation"
          onClick={() => setNavigationOpen((isOpen) => !isOpen)}
        >
          <span />
          <span />
          <span />
        </button>

        <div id="site-navigation" className={`navigation-panel${navigationOpen ? ' is-open' : ''}`}>
          <nav className="main-nav" aria-label="Main navigation">
            <a className="nav-link" href="#home" onClick={() => setNavigationOpen(false)}>Home</a>
            <a className="nav-link" href="#about" onClick={() => setNavigationOpen(false)}>About</a>
            <a className="nav-link" href="#categories" onClick={() => setNavigationOpen(false)}>Explore</a>
            <a className="nav-link" href="#service-guide" onClick={() => setNavigationOpen(false)}>Our services</a>
            <a className="nav-link" href="#contact" onClick={() => setNavigationOpen(false)}>Contact</a>
            <a className="nav-link" href="#profile" onClick={() => setNavigationOpen(false)}>Profile</a>
            {authUser?.role === 'customer' && (
              <a className="nav-link" href="#wallet" onClick={() => setNavigationOpen(false)}>Wallet</a>
            )}
          </nav>
        </div>

        <div className="header-account-actions">
          {authUser ? (
            <>
              <span className="signed-in-name">{authUser.name}</span>
              <button className="outline-button account-button" type="button" onClick={handleLogout}>Sign out</button>
            </>
          ) : (
            <>
              <button className="text-account-button admin-account-button" type="button" onClick={() => openAuth('admin')}>Admin sign in</button>
              <button className="outline-button account-button" type="button" onClick={() => openAuth('signin')}>Sign in</button>
              <button className="primary-button account-button" type="button" onClick={() => openAuth('signup')}>Sign up</button>
            </>
          )}
        </div>
      </header>

      <main>
        <section className="info-page" id="profile">
          <div className="profile-page-heading">
            <img src={`${import.meta.env.BASE_URL}hustle-hub-logo.svg`} alt="" />
            <div className="info-page-heading">
              <span className="section-kicker">Your account</span>
              <h1>Your profile</h1>
              <p>Manage your Hustle Hub account and keep your details close at hand.</p>
            </div>
          </div>
          {authUser ? (
            <div className="profile-summary">
              <div className="profile-summary-heading">
                <div>
                  <h2>{authUser.name}</h2>
                  <p>{authUser.email}</p>
                </div>
              </div>
              <dl>
                <div>
                  <dt>Account type</dt>
                  <dd>{authUser.role}</dd>
                </div>
              </dl>
              <button className="outline-button" type="button" onClick={handleLogout}>Sign out</button>
            </div>
          ) : (
            <div className="page-empty">
              <p>Sign in to view your account profile.</p>
              <button className="form-submit" type="button" onClick={() => openAuth('signin')}>Sign in</button>
            </div>
          )}
        </section>

        <section className="hero" id="home">
          <div className="hero-copy">
            <div className="eyebrow">
              <span className="eyebrow-dot" />
              Trusted local experts
            </div>
            <h1>
              Good work, <span>closer to home</span>
            </h1>
            <p className="hero-description">
              Find vetted professionals for home services, creative work, digital support, and everyday tasks across Kenya.
            </p>

            <div className="hero-search" role="search">
              <input type="text" placeholder="Search for services, skills, or nearby experts" aria-label="Search services" />
              <button className="search-submit" type="button" onClick={() => document.getElementById('book-services')?.scrollIntoView({ behavior: 'smooth' })}>Book now</button>
            </div>

            <div className="popular-searches" aria-label="Popular searches">
              <span>Popular:</span>
              {featuredServices.slice(0, 4).map((item) => (
                <button key={item} type="button">{item}</button>
              ))}
            </div>
          </div>

          <div className="hero-visual" aria-label="Featured services">
            <div className="feature-panel feature-panel-lg">
              <div>
                <span className="section-kicker">Featured service</span>
                <h3>Home care assistant</h3>
              </div>
              <strong>From KES 1,800</strong>
            </div>

            <div className="mini-stats">
              {highlights.map((stat) => (
                <div key={stat.label} className="mini-stat">
                  <strong>{stat.value}</strong>
                  <span>{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="category-section" id="categories">
          <div className="section-heading">
            <div>
              <span className="section-kicker">Browse categories</span>
              <h2>Find the right kind of help</h2>
            </div>
            <button className="outline-button" type="button">View all</button>
          </div>

          <div className="category-grid">
            {categories.map((category) => (
            <a
              key={category.name}
              className={`category-card has-image ${category.tone}`}
              href="#service-guide"
              onClick={() => setSelectedGuideCategory(category.name)}
            >
              <img
                className={`category-image${category.isLogo ? ' logo-image' : ''}`}
                src={category.image}
                  alt=""
                />
                <div className="category-copy">
                  <h3 className="category-name">{category.name}</h3>
                  <p className="category-summary">{category.summary}</p>
                </div>
            </a>
            ))}
          </div>
        </section>

        <section className="service-guide-section" id="service-guide">
        <div className="section-heading">
          <div>
            <span className="section-kicker">Service directory</span>
            <h2>Common services &amp; guide prices</h2>
          </div>
          <p className="service-guide-intro">Browse popular services across Kenya’s local categories.</p>
        </div>

        <div className="filter-pills guide-category-filters" role="group" aria-label="Filter guide prices by category">
          {categories.map((category) => (
            <button
              key={category.name}
              className={`filter-pill${selectedGuideCategory === category.name ? ' active' : ''}`}
              type="button"
              aria-pressed={selectedGuideCategory === category.name}
              onClick={() => setSelectedGuideCategory(category.name)}
            >
              {category.name}
            </button>
          ))}
        </div>

        {guidePhotoError && <p className="guide-photo-status error" role="alert">{guidePhotoError}</p>}
        {guidePhotoMessage && <p className="guide-photo-status" role="status">{guidePhotoMessage}</p>}

        <div className="guide-service-grid" aria-live="polite">
          {serviceGuide[selectedGuideCategory].map((service) => {
            const serviceKey = guideServiceKey(selectedGuideCategory, service.title)
            const customPhoto = guidePhotos[serviceKey]
            const stockPhoto = servicePhotoCredits[serviceKey]
            const photoUrl = customPhoto
              ? apiUrl(`/api/common-service-photos/${serviceKey}/photo?updated=${encodeURIComponent(customPhoto.updated_at)}`)
              : stockPhoto
                ? `${import.meta.env.BASE_URL}service-photos/${stockPhoto.fileName}`
                : categoryVisuals[selectedGuideCategory].image
            const licenseLabel = stockPhoto?.license === 'pexels'
              ? 'Pexels License'
              : stockPhoto?.license === 'by'
                ? `CC BY ${stockPhoto.licenseVersion}`
                : stockPhoto?.license === 'by-sa'
                  ? `CC BY-SA ${stockPhoto.licenseVersion}`
                  : stockPhoto?.license === 'cc0'
                    ? 'CC0'
                    : stockPhoto?.license === 'pdm'
                      ? 'Public domain'
                      : stockPhoto?.license

            return (
              <article className="guide-service-card" key={service.title}>
                <img
                  className="guide-service-image"
                  src={photoUrl}
                  alt={`${service.title} service`}
                  loading="lazy"
                />
                {!customPhoto && stockPhoto && (
                  <small className="guide-service-credit">
                    Photo: <a href={stockPhoto.sourceUrl} target="_blank" rel="noreferrer">{stockPhoto.creator || 'Openverse contributor'}</a>
                    {' · '}
                    <a href={stockPhoto.licenseUrl} target="_blank" rel="noreferrer">{licenseLabel}</a>
                  </small>
                )}
                <span className="guide-service-category">{selectedGuideCategory}</span>
                <h3>{service.title}</h3>
                <p>Suggested price</p>
                <div className="guide-service-price">
                  <strong>KES {service.price}</strong>
                  {service.unit && <span>{service.unit}</span>}
                </div>
                {authUser?.role === 'admin' && (
                  <label className="guide-service-upload">
                    {guidePhotoSaving[serviceKey] ? 'Uploading…' : customPhoto ? 'Replace photo' : 'Upload photo'}
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      aria-label={`Upload photo for ${service.title}`}
                      disabled={guidePhotoSaving[serviceKey]}
                      onChange={(event) => handleGuidePhotoUpload(event, serviceKey, service.title)}
                    />
                  </label>
                )}
              </article>
            )
          })}
        </div>
        <p className="service-guide-note">These are indicative price ranges, not provider quotes. Confirm the final price with your chosen professional.</p>
        </section>

        <section className="section-wrap marketplace-section live-services-section" id="book-services">
          <div className="section-heading marketplace-heading">
            <div>
              <span className="section-kicker">Available now</span>
              <h2>Book a service</h2>
            </div>
            <p className="service-guide-intro">Choose an active provider and send a service request.</p>
          </div>

          <div className="live-service-filters">
            <input
              type="search"
              aria-label="Search available services"
              placeholder="Search services, providers, or locations"
              value={serviceSearch}
              onChange={(event) => setServiceSearch(event.target.value)}
            />
            <select
              aria-label="Filter available services by category"
              value={serviceCategory}
              onChange={(event) => setServiceCategory(event.target.value)}
            >
              <option>All services</option>
              {categories.map((category) => <option key={category.name}>{category.name}</option>)}
            </select>
          </div>

          {orderNotice && <p className="guide-photo-status error" role="alert">{orderNotice}</p>}
          {orderSuccess && <p className="guide-photo-status" role="status">{orderSuccess}</p>}
          {serviceListingsLoading ? (
            <p className="services-message" role="status">Loading available services…</p>
          ) : serviceListingsError ? (
            <p className="services-message services-error" role="alert">{serviceListingsError}</p>
          ) : filteredServices.length ? (
            <div className="service-grid">
              {filteredServices.map((service) => (
                <article className="service-card" key={service.id}>
                  <div className={`service-art ${service.provider_color || 'mint'}`}>
                    {categoryVisuals[service.category]?.image ? (
                      <img
                        className="service-art-image"
                        src={service.listing_photo_updated_at
                          ? apiUrl(`/api/services/${service.id}/photo?updated=${encodeURIComponent(service.listing_photo_updated_at)}`)
                          : service.bookingPhoto.src}
                        alt={`${service.title} service`}
                        loading="lazy"
                        onError={(event) => {
                          event.currentTarget.onerror = null
                          event.currentTarget.src = service.bookingPhoto.src
                        }}
                      />
                    ) : (
                      <span className="service-art-icon" aria-hidden="true">{service.icon || '✦'}</span>
                    )}
                    <span className="service-art-label">{service.category}</span>
                  </div>
                  {service.bookingPhoto.credit && (
                    <small className="service-photo-credit">
                      Photo: <a href={service.bookingPhoto.credit.sourceUrl} target="_blank" rel="noreferrer">
                        {service.bookingPhoto.credit.creator}
                      </a>
                      {' · '}
                      <a href={service.bookingPhoto.credit.licenseUrl} target="_blank" rel="noreferrer">
                        {service.bookingPhoto.credit.license.toUpperCase()} {service.bookingPhoto.credit.licenseVersion}
                      </a>
                    </small>
                  )}
                  <div className="service-card-body">
                    <div className="provider-row">
                      <span className="provider-name">By {service.provider_name}</span>
                    </div>
                    <h3 className="service-title">{service.title}</h3>
                    <p className="service-summary">{service.description}</p>
                    <p className="service-location">{service.location}</p>
                    <div className="service-card-footer">
                      <span className="service-price">From <b>KES {Number(service.price).toLocaleString('en-KE')}</b></span>
                      <button className="form-submit service-book-button" type="button" onClick={() => handleOrderService(service)}>
                        Book service
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <p className="services-message">
              {serviceListings.length
                ? 'No services match your search. Try another category or search term.'
                : 'No bookable services are available right now. Please check back soon.'}
            </p>
          )}
        </section>

        <section className="section-wrap muted-section" id="about">
          <div className="info-grid">
            <div>
              <span className="section-kicker">Why people choose us</span>
              <h2>Fast, local, and dependable</h2>
              <p>
                Browse trusted local specialists, compare rates, and book confidently with clear reviews and communication.
              </p>
            </div>
            <div className="info-list">
              <div>
                <strong>Verified profiles</strong>
                <span>Each professional is background-checked and reviewed.</span>
              </div>
              <div>
                <strong>Flexible bookings</strong>
                <span>Book on your schedule with support that moves with you.</span>
              </div>
              <div>
                <strong>Fair pricing</strong>
                <span>Clear quotes and transparent service comparisons.</span>
              </div>
            </div>
          </div>
        </section>

        <section className="info-page" id="contact">
          <div className="info-page-heading">
            <span className="section-kicker">Get in touch</span>
            <h1>Contact Hustle Hub</h1>
            <p>Questions about finding local services or joining the community? Call or email us and we’ll be glad to help.</p>
          </div>
          <div className="contact-methods">
            <a className="contact-method email-contact-method" href="mailto:makaushadrack147@gmail.com">
              <svg className="contact-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
                <rect x="3" y="5" width="18" height="14" rx="2" />
                <path d="m3 7 9 6 9-6" />
              </svg>
              <span className="contact-method-copy">
                <span>Email</span>
                <strong>makaushadrack147@gmail.com</strong>
                <small>We’re here to help with your questions.</small>
              </span>
            </a>
            <a className="contact-method phone-contact-method" href="tel:+254115820492">
              <svg className="contact-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
                <path d="M5 4h4l2 5-2.5 1.5a15 15 0 0 0 5 5L15 13l5 2v4a1 1 0 0 1-1 1A16 16 0 0 1 4 5a1 1 0 0 1 1-1Z" />
              </svg>
              <span className="contact-method-copy">
                <span>Phone</span>
                <strong>0115 820 492</strong>
                <small>Call us for support.</small>
              </span>
            </a>
          </div>
        </section>

        {authUser?.role === 'customer' && (
          <section className="info-page wallet-page" id="wallet">
            <div className="info-page-heading">
              <span className="section-kicker">Your account</span>
              <h1>Your wallet</h1>
              <p>Review your service payments and wallet balance.</p>
            </div>
            <div className="wallet-summary">
              <div className="wallet-balance">
                <span>Available balance</span>
                <strong>KES {Number(walletSummary?.available_balance || 0).toLocaleString('en-KE')}</strong>
                <small>Hustle Hub does not store wallet funds.</small>
              </div>
              <div className="wallet-paid-total">
                <span>Total paid for services</span>
                <strong>
                  KES {Number(walletSummary?.total_paid || 0).toLocaleString('en-KE')}
                </strong>
              </div>
            </div>
            <div className="wallet-history">
              <h2>Recent payment history</h2>
              {walletLoading ? (
                <p className="wallet-message" role="status">Loading your wallet history…</p>
              ) : walletError ? (
                <p className="wallet-message wallet-error" role="alert">{walletError}</p>
              ) : walletTransactions.length > 0 ? (
                <div className="wallet-list">
                  {walletTransactions.map((transaction) => (
                    <article className="wallet-row" key={transaction.payment_id}>
                      <div>
                        <strong>{transaction.service_title}</strong>
                        <span>{transaction.provider_name ? `Provider: ${transaction.provider_name}` : 'Service payment'}</span>
                        <small>{formatPaymentDate(transaction.payment_created_at)}</small>
                        {transaction.payment_receipt && <small>Receipt: {transaction.payment_receipt}</small>}
                      </div>
                      <div className="wallet-row-amount">
                        <b>KES {Number(transaction.payment_amount).toLocaleString('en-KE')}</b>
                        <span className={`wallet-status status-${transaction.payment_status}`}>
                          {transaction.payment_status}
                        </span>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <p className="wallet-message">Your service payment history will appear here.</p>
              )}
              <p className="wallet-disclaimer">
                Payments are made directly to service providers. This wallet view does not accept deposits or hold funds.
              </p>
            </div>
          </section>
        )}
      </main>

      {selectedOrderService && authUser?.role === 'customer' && (
        <div className="modal-backdrop" onClick={(event) => {
          if (event.target === event.currentTarget && !orderSaving) setSelectedOrderService(null)
        }}>
          <section className="modal-card" role="dialog" aria-modal="true" aria-labelledby="order-dialog-title">
            <button
              className="modal-close"
              type="button"
              aria-label="Close booking dialog"
              disabled={orderSaving}
              onClick={() => setSelectedOrderService(null)}
            >×</button>
            <span className="section-kicker">Service request</span>
            <h2 id="order-dialog-title">Book {selectedOrderService.title}</h2>
            <p className="modal-intro">
              Provider: {selectedOrderService.provider_name} · KES {Number(selectedOrderService.price).toLocaleString('en-KE')}
            </p>
            <form className="account-form service-request-form" onSubmit={handleServiceOrderSubmit}>
              <label>
                Service location
                <input
                  type="text"
                  maxLength={100}
                  required
                  value={orderLocation}
                  onChange={(event) => setOrderLocation(event.target.value)}
                  placeholder="Town, neighborhood, or online"
                />
              </label>
              <label>
                Preferred date
                <input
                  type="date"
                  min={today}
                  required
                  value={orderDate}
                  onChange={(event) => setOrderDate(event.target.value)}
                />
              </label>
              <label>
                Request details
                <textarea
                  maxLength={500}
                  required
                  rows={4}
                  value={orderDetails}
                  onChange={(event) => setOrderDetails(event.target.value)}
                  placeholder="Tell the provider what you need."
                />
              </label>
              {orderError && <p className="auth-feedback error" role="alert">{orderError}</p>}
              <button className="form-submit" type="submit" disabled={orderSaving}>
                {orderSaving ? 'Sending request…' : 'Send service request'}
              </button>
            </form>
          </section>
        </div>
      )}

      {authOpen && (
        <div className="modal-backdrop auth-backdrop" onClick={(event) => {
          if (event.target === event.currentTarget) setAuthOpen(false)
        }}>
          <section className="modal-card auth-card" role="dialog" aria-modal="true" aria-labelledby="account-dialog-title">
            <button className="modal-close" type="button" aria-label="Close account dialog" onClick={() => setAuthOpen(false)}>×</button>
            <img className="auth-logo" src={`${import.meta.env.BASE_URL}hustle-hub-logo.svg`} alt="" />
            <span className="section-kicker">
              {authMode === 'admin' ? 'Administrator access' : 'Hustle Hub Kenya'}
            </span>
            <h2 id="account-dialog-title">
              {authMode === 'signup' ? 'Create your account'
                : authMode === 'forgot' ? 'Forgot your password?'
                  : authMode === 'reset' ? 'Set a new password'
                    : authMode === 'admin' ? 'Administrator sign in'
                      : 'Welcome back'}
            </h2>
            <p className="modal-intro">
              {authMode === 'signup' ? 'Join Hustle Hub to find local services or share your skills.'
                : authMode === 'forgot' ? 'Enter your email and we’ll send a secure password reset link if an account exists.'
                  : authMode === 'reset' ? 'Choose a new password for your Hustle Hub account.'
                    : authMode === 'admin' ? 'Sign in with your administrator account to manage the service directory.'
                      : 'Sign in to continue to Hustle Hub Kenya.'}
            </p>
            <form
              className="account-form"
              onSubmit={authMode === 'forgot'
                ? handleForgotPasswordSubmit
                : authMode === 'reset'
                  ? handleResetPasswordSubmit
                  : handleAuthSubmit}
            >
              {authMode === 'signup' && (
                <>
                  <label>
                    Full name
                    <input
                      type="text"
                      autoComplete="name"
                      maxLength={80}
                      required
                      value={authName}
                      onChange={(event) => setAuthName(event.target.value)}
                    />
                  </label>
                  <label>
                    I want to
                    <select value={authRole} onChange={(event) => setAuthRole(event.target.value)}>
                      <option value="customer">Find local services</option>
                      <option value="freelancer">Offer my skills</option>
                    </select>
                  </label>
                </>
              )}
              {authMode !== 'reset' && (
                <label>
                  Email
                  <input
                    type="email"
                    autoComplete="email"
                    maxLength={254}
                    required
                    value={authEmail}
                    onChange={(event) => setAuthEmail(event.target.value)}
                  />
                </label>
              )}
              {['signup', 'signin', 'admin', 'reset'].includes(authMode) && (
                <label>
                  {authMode === 'reset' ? 'New password' : 'Password'}
                  <input
                    type="password"
                    autoComplete={authMode === 'reset' ? 'new-password' : authMode === 'signup' ? 'new-password' : 'current-password'}
                    minLength={8}
                    maxLength={200}
                    required
                    value={authPassword}
                    onChange={(event) => setAuthPassword(event.target.value)}
                  />
                </label>
              )}
              {['signup', 'reset'].includes(authMode) && (
                <label>
                  Confirm password
                  <input
                    type="password"
                    autoComplete="new-password"
                    minLength={8}
                    maxLength={200}
                    required
                    value={authConfirmPassword}
                    onChange={(event) => setAuthConfirmPassword(event.target.value)}
                  />
                </label>
              )}
              {authError && <p className="auth-feedback error" role="alert">{authError}</p>}
              {authMessage && <p className="auth-feedback" role="status">{authMessage}</p>}
              <button className="form-submit" type="submit" disabled={authLoading}>
                {authLoading ? 'Please wait…'
                  : authMode === 'signup' ? 'Create account'
                    : authMode === 'forgot' ? 'Send reset link'
                      : authMode === 'reset' ? 'Reset password'
                        : 'Sign in'}
              </button>
            </form>
            <div className="auth-links">
              {['signin', 'admin'].includes(authMode) && (
                <button type="button" onClick={() => openAuth('forgot')}>Forgot password?</button>
              )}
              {['signin', 'admin'].includes(authMode) && (
                <button type="button" onClick={() => openAuth('signup')}>Create an account</button>
              )}
              {authMode === 'signin' && (
                <button type="button" onClick={() => openAuth('admin')}>Administrator sign in</button>
              )}
              {authMode === 'admin' && (
                <button type="button" onClick={() => openAuth('signin')}>Regular account sign in</button>
              )}
              {authMode === 'signup' && (
                <button type="button" onClick={() => openAuth('signin')}>Already have an account? Sign in</button>
              )}
              {['forgot', 'reset'].includes(authMode) && (
                <button type="button" onClick={() => openAuth('signin')}>Back to sign in</button>
              )}
            </div>
          </section>
        </div>
      )}
    </div>
  )
}

export default App
