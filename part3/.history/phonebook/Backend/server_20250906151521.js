import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import Person from "./models/person.js";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Connect to MongoDB and start server after connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");

    const PORT = process.env.PORT || 3001;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.error("MongoDB connection error:", err.message));

// -------------------- ROUTES -------------------- //

// Get all persons
app.get("/api/persons", async (req, res, next) => {
  try {
    const people = await Person.find({});
    res.json(people);
  } catch (err) {
    next(err);
  }
});

// Get single person by ID
app.get("/api/persons/:id", async (req, res, next) => {
  try {
    const person = await Person.findById(req.params.id);
    if (person) {
      res.json(person);
    } else {
      res.status(404).json({ error: "Person not found" });
    }
  } catch (err) {
    next(err);
  }
});

// Info route
app.get("/info", async (req, res, next) => {
  try {
    const count = await Person.countDocuments({});
    res.send(`<p>Phonebook has info for ${count} people</p><p>${new Date()}</p>`);
  } catch (err) {
    next(err);
  }
});

// Add a new person
app.post('/api/persons', async (req, res, next) => {
  try {
    const { name, number } = req.body
    const person = new Person({ name, number })
    const saved = await person.save()
    res.status(201).json(saved)
  } catch (err) { next(err) }
});

// Update existing person
app.put("/api/persons/:id", async (req, res, next) => {
  

  try {
    const { name, number } = req.body;
    const updated = await Person.findByIdAndUpdate(
      req.params.id,
      { name, number },
      { new: true, runValidators: true, context: "query" }
    );

    if (updated) {
      res.json(updated);
    } else {
      res.status(404).json({ error: "Person not found" });
    }
  } catch (err) {
    next(err);
  }
});

// Delete a person
app.delete('/api/persons/:id', async (req, res, next) => {
  try {
    await Person.findByIdAndRemove(req.params.id)
    res.status(204).end()
  } catch (err) { next(err) }
})

// -------------------- ERROR HANDLING -------------------- //

app.use((err, req, res, next) => {
  console.error("Error caught by middleware:", err); // log full error

  if (err.name === "CastError") {
    return res.status(400).json({ error: "malformatted id" });
  } else if (err.name === "ValidationError") {
    return res.status(400).json({ error: err.message });
  }

  res.status(500).json({ error: "Something went wrong" });
});

