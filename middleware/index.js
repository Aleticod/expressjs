const express = require('express')
const app = express()

// middleware
const myLogger = function(req, res, next) {
  console.log('LOGGED')
  next()
}

const requestTime = function(req, res, next) {
  req.requestTime = Date.now()
  next()
}

app.use(myLogger)
app.use(requestTime)

app.get('/', (req, res) => {
  let responseText = 'Hello world</br>'
  responseText += `<small>Requested at: ${req.requestTime}</small>`
  res.send(responseText)
})

app.listen(3000)