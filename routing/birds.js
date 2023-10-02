const express = require('express')
const router = express.Router()

// Middleware that is specific to this router
router.use((req, res, next) => {
  console.log('Time: ', Date.now())
  next()
})

// Define the home page route
router.get('/', (req, res) => {
  res.send('Birds home page')
})

// Define the about route
router.get('/about', (req, res) => {
  res.send('About birds')
})

module.exports = router