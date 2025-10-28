import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import Person from "./models/person.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error("MongoDB connection error:", err.message));

app.get("/", (req, res) => {
  res.send("Backend server ")
})

app.get("/api/persons", async (req, res, next) => {
  try {
    const people = await Person.find({});
    res.json(people);
  } catch (err) {
    next(err);
  }
});

app.get("/api/persons/:id", async (req, res, next) => {
  try {
    const person = await Person.findById(req.params.id);
    if (person) res.json(person);
    else res.status(404).json({ error: "Person not found" });
  } catch (err) {
    next(err);
  }
});

app.get("/info", async (req, res, next) => {
  try {
    const count = await Person.countDocuments({});
    res.send(`<p>Phonebook has info for ${count} people</p><p>${new Date()}</p>`);
  } catch (err) {
    next(err);
  }
});

app.post("/api/persons", async (req, res, next) => {
  try {
    const { name, number } = req.body;
    const person = new Person({ name, number });
    const saved = await person.save();
    res.status(201).json(saved);
  } catch (err) {
    next(err);
  }
});

app.put("/api/persons/:id", async (req, res, next) => {
  try {
    const { name, number } = req.body;
    const updated = await Person.findByIdAndUpdate(
      req.params.id,
      { name, number },
      { new: true, runValidators: true, context: "query" }
    );
    if (updated) res.json(updated);
    else res.status(404).json({ error: "Person not found" });
  } catch (err) {
    next(err);
  }
});

app.delete("/api/persons/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid ID format" });
    }
    const deleted = await Person.findByIdAndDelete(id);
    if (deleted) res.status(204).end();
    else res.status(404).json({ error: "Person not found" });
  } catch (err) {
    next(err);
  }
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "dist", "index.html"));
  });
}


app.use((err, req, res, next) => {
  console.error("Error caught by middleware:", err.message);
  if (err.name === "CastError") return res.status(400).json({ error: "malformatted id" });
  if (err.name === "ValidationError") return res.status(400).json({ error: err.message });
  res.status(500).json({ error: "Something went wrong" });
});


const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
