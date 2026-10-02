const path = require('node:path')
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const Parser = require('rss-parser')

const app = express()
const parser = new Parser({ timeout: 15000 })
const feedUrl = 'https://thefactfile.org/feed/'
const cacheDurationMs = 5 * 60 * 1000
let cachedPosts = null
let cacheExpiresAt = 0

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'public', 'pages'))
app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

function normalizePost(item) {
  const rawCategories = item.categories || item.category || []
  const categories = (Array.isArray(rawCategories) ? rawCategories : [rawCategories])
    .map((category) => String(category).trim())
    .filter(Boolean)

  return {
    title: item.title || 'Untitled fact',
    link: item.link || 'https://thefactfile.org/',
    publishedAt: item.isoDate || item.pubDate || '',
    creator: item.creator || item.author || 'Unknown',
    categories,
    content: item.contentSnippet || item.content || item.summary || 'No description available.',
  }
}

async function getPosts() {
  if (cachedPosts && Date.now() < cacheExpiresAt) {
    return cachedPosts
  }

  const feed = await parser.parseURL(feedUrl)
  cachedPosts = (feed.items || []).map(normalizePost)
  cacheExpiresAt = Date.now() + cacheDurationMs
  return cachedPosts
}

function getCategoryOptions(posts) {
  return [...new Set(posts.flatMap((post) => post.categories))]
    .sort((first, second) => first.localeCompare(second))
}

async function renderSearchPage(response, options = {}) {
  let allPosts = []
  let errorMessage = options.errorMessage || ''

  try {
    allPosts = await getPosts()
  } catch (error) {
    console.error('Unable to load RSS feed:', error.message)
    errorMessage ||= 'The facts feed is temporarily unavailable. Please try again later.'
  }

  return response.render('search', {
    posts: options.posts || [],
    categories: getCategoryOptions(allPosts),
    titles: allPosts.map((post) => post.title),
    searchTitle: options.searchTitle || '',
    selectedCategory: options.selectedCategory || '',
    errorMessage,
  })
}

app.get('/', async (request, response) => {
  try {
    const posts = await getPosts()
    response.render('index', { posts, errorMessage: '' })
  } catch (error) {
    console.error('Unable to load RSS feed:', error.message)
    response.status(502).render('index', {
      posts: [],
      errorMessage: 'The facts feed is temporarily unavailable. Please try again later.',
    })
  }
})

app.get('/search', async (request, response) => {
  await renderSearchPage(response)
})

app.post('/search/title', async (request, response) => {
  const searchTitle = String(request.body.title || '').trim()

  try {
    const allPosts = await getPosts()
    const posts = searchTitle
      ? allPosts.filter((post) => post.title.toLowerCase().includes(searchTitle.toLowerCase()))
      : []

    await renderSearchPage(response, {
      posts,
      searchTitle,
      errorMessage: searchTitle ? '' : 'Enter a title to search for.',
    })
  } catch (error) {
    console.error('Unable to search RSS titles:', error.message)
    await renderSearchPage(response, {
      searchTitle,
      errorMessage: 'The facts feed is temporarily unavailable. Please try again later.',
    })
  }
})

app.post('/search/category', async (request, response) => {
  const selectedCategory = String(request.body.category || '').trim()

  try {
    const allPosts = await getPosts()
    const posts = selectedCategory
      ? allPosts.filter((post) => post.categories.includes(selectedCategory))
      : []

    await renderSearchPage(response, {
      posts,
      selectedCategory,
      errorMessage: selectedCategory ? '' : 'Choose a category to search for.',
    })
  } catch (error) {
    console.error('Unable to search RSS categories:', error.message)
    await renderSearchPage(response, {
      selectedCategory,
      errorMessage: 'The facts feed is temporarily unavailable. Please try again later.',
    })
  }
})

const port = Number(process.env.PORT) || 3000

if (require.main === module) {
  app.listen(port, () => {
    console.log(`Fact Feed Reader listening on http://localhost:${port}`)
  })
}

module.exports = app