const express = require('express')
const app = express()

app.set('view engine', 'pug')

app.get('/', (req, res) => {
  res.render('index', {title: 'Hey', message: 'Hello there!'})
})

app.listen(3000, () => {
  console.log('page listening into port 3000')
})