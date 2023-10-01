const express = require('express')
const app = express()

app.get('/', (req, res) => {
  res.send('<h1>Prueba de la RUTA GET</h1>')
})

app.get('/about', (req, res) => {
  res.send('/about')
})

app.get('/random.txt', (req, res) => {
  res.send('random.txt')
})

app.get(/a/, (req, res) => {
  res.send('/a/')
})

app.get('/users/:userId/books/:bookId', (req, res) => {
  res.send(req.params)
})

app.get('/flights/:from-:to', (req, res) => {
  res.send(req.params)
})

app.get('/user/:userId(\\d+)', (req, res) => {
  res.send(req.params)
})

app.listen(3000, () => {
  console.log('random.txt')
})