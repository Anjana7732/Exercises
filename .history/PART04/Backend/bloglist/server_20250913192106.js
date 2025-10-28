// server.js
const http = require('http')
const app = require('./app') // no .js needed if commonjs

const PORT = process.env.PORT || 3001
const server = http.createServer(app)
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
