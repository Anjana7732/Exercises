const app = require('./app')
const http = require('')

const PORT = 3003
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})