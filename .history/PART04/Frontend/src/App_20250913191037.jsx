import React, { useState, useEffect } from 'react'
import axios from 'axios'
import BlogList from './components/BlogList'

const App = () => {
  const [blogs, setBlogs] = useState([])

  useEffect(() => {
    // Fetch blogs from backend (or a JSON file)
    axios.get('/api/blogs')
      .then(response => setBlogs(response.data))
      .catch(error => console.error(error))
  }, [])

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Blog List</h1>
      <BlogList blogs={blogs} />
    </div>
  )
}

export default App
