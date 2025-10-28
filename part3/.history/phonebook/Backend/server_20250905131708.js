import dotenv from "dotenv";
// const express = require('express')
import mongoose from "mongoose";
// const mongoose = require('mongoose')
import cors from ("cors");
// const cors = require('cors')
// const morgan = require('morgan')
import mor


dotenv.config();

const app = express()
app.use(cors())
app.use(express.json())
app.use(morgan('dev'))

// Mongoose connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => {
    console.error('MongoDB connection error:', err.message)
    process.exit(1)
  })

// Model
const personSchema = new mongoose.Schema({
  name: { type: String, required: true },
  number: { type: String, required: true }
})
const Person = mongoose.model('Person', personSchema)

// Routes
app.get('/api/persons', async (req, res, next) => {
  try {
    const people = await Person.find({})
    res.json(people)
  } catch (err) { next(err) }
})

app.get('/api/persons/:id', async (req, res, next) => {
  try {
    const p = await Person.findById(req.params.id)
    if (p) res.json(p)
    else res.status(404).end()
  } catch (err) { next(err) }
})

app.post('/api/persons', async (req, res, next) => {
  try {
    const { name, number } = req.body
    const person = new Person({ name, number })
    const saved = await person.save()
    res.status(201).json(saved)
  } catch (err) { next(err) }
})

app.put('/api/persons/:id', async (req, res, next) => {
  try {
    const { name, number } = req.body
    const updated = await Person.findByIdAndUpdate(
      req.params.id,
      { name, number },
      { new: true, runValidators: true, context: 'query' }
    )
    if (updated) res.json(updated)
    else res.status(404).end()
  } catch (err) { next(err) }
})

app.delete('/api/persons/:id', async (req, res, next) => {
  try {
    await Person.findByIdAndRemove(req.params.id)
    res.status(204).end()
  } catch (err) { next(err) }
})

// Error handler
app.use((err, req, res, next) => {
  console.error(err.message)
  if (err.name === 'CastError') return res.status(400).send({ error: 'malformatted id' })
  if (err.name === 'ValidationError') return res.status(400).json({ error: err.message })
  res.status(500).end()
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
