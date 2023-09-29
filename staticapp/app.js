const express = require('express');

// Variables
const PORT = 3000;

// Init a express server
const app = express();

app.use(express.static('public'));

// Server listening
app.listen(PORT, () => {
  console.log(`Server is listening on http://localhost:${PORT}`);
  console.log(__dirname)
})