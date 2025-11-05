const express = require('express');
const cors = require('cors');
require('dotenv').config();

const Blog = require('./models/blog');
const sequelize = require('./util/db');

const app = express();

app.use(cors());
app.use(express.json());

// ROUTES
app.get('/api/blogs', async (req, res) => {
  try {
    const blogs = await Blog.findAll();
    res.json(blogs);
  } catch (error) {
    console.error('Error fetching blogs:', error);
    res.status(500).json({ error: 'Failed to fetch blogs' });
  }
});

app.get('/api/blogs/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const blog = await Blog.findByPk(id);

    if (!blog) {
      return res.status(404).json({ error: 'Blog not found' });
    }

    res.json(blog);
  } catch (error) {
    console.error('Error fetching blog:', error);
    res.status(500).json({ error: 'Failed to fetch blog' });
  }
});

app.post('/api/blogs', async (req, res) => {
  try {
    const blog = await Blog.create(req.body);
    res.status(201).json(blog);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: 'Failed to create blog' });
  }
});

app.delete('/api/blogs/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const blog = await Blog.findByPk(id);

    if (!blog) {
      return res.status(404).json({ error: 'Blog not found' });
    }

    await blog.destroy();
    res.status(204).end();
  } catch (error) {
    console.error('Error deleting blog:', error);
    res.status(500).json({ error: 'Failed to delete blog' });
  }
});

// START SERVER
const PORT = process.env.PORT || 3001;
(async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected');
    
    // Sync database (create tables if they don't exist)
    // Use force: false to avoid dropping existing tables
    // Use alter: false to avoid modifying existing table structure
    await Blog.sync({ force: false, alter: false });
    console.log('✅ Blog model synced');
    
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📝 API available at http://localhost:${PORT}/api/blogs`);
    });
  } catch (error) {
    console.error('❌ Unable to start server:', error);
    console.error('Error details:', error.message);
    process.exit(1);
  }
})();

