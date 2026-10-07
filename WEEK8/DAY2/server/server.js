import express from 'express'

const app = express()
const port = process.env.PORT || 3001

app.use(express.json())

app.get('/api/hello', (request, response) => {
  response.json({ message: 'Hello From Express' })
})

app.post('/api/world', (request, response) => {
  console.log(request.body)
  const inputValue = typeof request.body?.inputValue === 'string' ? request.body.inputValue : ''

  response.json({
    message: `I received your POST request. This is what you sent me: ${inputValue}`,
  })
})

app.listen(port, () => {
  console.log(`Express server listening on http://localhost:${port}`)
})