const express = require('express')
const app  = express()

app.use((req, res, next) => {
  console.log('Time:', Date.now())
  next()
})

app.use('/user/:id', (req, res, next) => {
  console.log('Request Type: ', req.method)
  next()
})

app.get('/user/:id', (req, res, next) => {
  // res.send('USER')
  console.log('USER')
  next()
})

app.get('/user/:id', (req, res, next) => {
  console.log('Request URL', req.originalUrl)
  next()
}, (req, res, next) => {
  console.log('Request Type:', req.method)
  next()
})

app.get('/user/:id', (req, res, next) => {
  // if the user ID is 0, skip to the next route
  if (req.params.id === '0') next('route')
  // otherwise pass the control to the next middleware function in this stack
  else next()
}, (req, res, next) => {
  // send a regular response
  res.send('regular')
})

// handler for the /user/:id path, which sends a special response
app.get('/user/:id', (req, res, next) => {
  res.send('<h1>Te amo Jaquelin💗</h1>')
})


app.listen(3000, () => {
  console.log('Server work')
})

