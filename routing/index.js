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

// app.get(/a/, (req, res) => {
//   res.send('/a/')
// })

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
  console.log('The server is listening on PORT 3000')
})

// handlers

app.get('/example/b', (req, res, next) => {
  console.log('The response will be sent by the next function ...')
  next()
}, (req, res) => {
  res.send('Hello from b')
})

// An array of callback

const cb0 = function(req, res, next) {
  console.log('CB0');
  next()
}

const cb1 = function(req, res, next) {
  console.log('CB1')
  next()
}

const cb2 = function(req, res) {
  res.send('Hello from c')
}

app.get('/example/c', [cb0, cb1, cb2])

app.get('/example/d', [cb0, cb1], (req, res, next) => {
  console.log('the response will be sent by the next function...')
  next()
}, (req, res) => {
  res.send('Hello from D')
})

// app.route()

app.route('/book')
  .get((req, res) => {
    res.send('Get a random book')
  })
  .post((req, res) => {
    res.send('Add a book')
  })
  .put((req, res) => {
    res.send('Update the book')
  })

// Import the router module

const birds = require('./birds')

app.use('/birds', birds)