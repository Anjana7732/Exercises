import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import Person from "./models/person.js";  

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));


mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err.message));


  
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
    if (person) {
      res.json(person);
    } else {
      res.status(404).json({ error: "Person not found" });
    }
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


app.use((err, req, res, next) => {
  console.error(err.message);
  res.status(500).json({ error: "Something went wrong" });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
