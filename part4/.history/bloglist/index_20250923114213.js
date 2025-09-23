const app = require('./app')
const http = require('htt')

const PORT = 3003
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})