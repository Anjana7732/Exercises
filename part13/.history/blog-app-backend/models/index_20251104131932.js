const express = require('express');
const cors = require('cors');
require('dotenv').config();

const db = require('./models'); // this loads models/index.js
const Blog = db.blog; // assuming you defined blog.js model

const app = express();
app.use(cors());
app.use(express.json());

// ROUTES
app.get('/api/blogs', async (req, res) => {
  const blogs = await Blog.findAll();
  res.json(blogs);
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
  const id = req.params.id;
  const blog = await Blog.findByPk(id);

  if (!blog) {
    return res.status(404).json({ error: 'Blog not found' });
  }

  await blog.destroy();
  res.status(204).end();
});

// START SERVER
const PORT = process.env.PORT || 3001;
(async () => {
  try {
    await db.sequelize.authenticate();
    console.log('✅ Database connected');
    await db.sequelize.sync();
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  } catch (error) {
    console.error('❌ Unable to start server:', error);
  }
})();
