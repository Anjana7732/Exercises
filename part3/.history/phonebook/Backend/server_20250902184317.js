import express from "express";
import cors from "cors";

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

let persons = [
  { id: "1", name: "Arto Hellas", number: "040-123456" },
  { id: "2", name: "Ada Lovelace", number: "39-44-5323523" },
  { id: "3", name: "Dan Abramov", number: "12-43-234345" },
  { id: "4", name: "Mary Poppendieck", number: "39-23-6423122" },
];

// ✅ GET all persons
app.get("/api/persons", (req, res) => {
  res.json(persons);
});

// ✅ GET person by ID
app.get("/api/persons/:id", (req, res) => {
  console.log("Received request for id:", req.params.id);
  const id = req.params.id;
  const person = persons.find((p) => p.id === id);

  if (person) {
    res.json(person);
  } else {
    res.status(404).end();
  }
});

// ✅ Root
app.get("/", (req, res) => {
  res.send("<h1>Phonebook Backend Running</h1>");
});

// ✅ Info
app.get("/info", (req, res) => {
  const count = persons.length;
  const times = new Date();
  res.send(`
    <p>Phonebook has info for ${count} people</p>
    <p>${times}</p>
  `);
});

// ✅ DELETE person by ID
app.delete("/api/persons/:id", (req, res) => {
  const id = req.params.id;
  console.log("DELETE request received for id:", id);

  const beforeCount = persons.length;
  persons = persons.filter((person) => person.id !== id);

  if (beforeCount === persons.length) {
    console.log(`No person found with id: ${id}`);
    return res.status(404).json({ error: "Person not found" });
  }

  console.log(`Person with id ${id} deleted`);
  res.status(204).end();
});

// ✅ Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
