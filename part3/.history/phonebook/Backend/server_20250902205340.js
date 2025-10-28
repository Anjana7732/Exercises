import express from "express";
import cors from "cors";
import morgan from "morgan";

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Morgan custom token for POST body logging
morgan.token("body", (req) => {
  return req.method === "POST" ? JSON.stringify(req.body) : "";
});

// Use morgan with tiny config + our custom token
app.use(morgan(":method :url :status :res[content-length] - :response-time ms :body"));

let persons = [
  { id: "1", name: "Arto Hellas", number: "040-123456" },
  { id: "2", name: "Ada Lovelace", number: "39-44-5323523" },
  { id: "3", name: "Dan Abramov", number: "12-43-234345" },
  { id: "4", name: "Mary Poppendieck", number: "39-23-6423122" },
];

// Get all persons
app.get("/api/persons", (req, res) => {
  res.json(persons);
});

// Get one person
app.get("/api/persons/:id", (req, res) => {
  const id = req.params.id;
  const person = persons.find((p) => p.id === id);

  if (person) {
    res.json(person);
  } else {
    res.status(404).end();
  }
});

// Root route
app.get("/", (req, res) => {
  res.send("<h1>Phonebook Backend Running</h1>");
});

// Info route
app.get("/info", (req, res) => {
  const count = persons.length;
  const times = new Date();
  res.send(`
    <p>Phonebook has info for ${count} people</p>
    <p>${times}</p>
  `);
});

// Delete person
app.delete("/api/persons/:id", (req, res) => {
  const id = req.params.id;
  persons = persons.filter((person) => person.id !== id);

  res.status(204).end();
});

// Add new person
app.post("/api/persons", (req, res) => {
  const body = req.body;

  if (!body || !body.name || !body.number) {
    return res.status(400).json({ error: "Name or number missing" });
  }

  if (persons.find((p) => p.name === body.name)) {
    return res.status(400).json({ error: "Name must be unique" });
  }

  const newPerson = {
    id: String(Math.max(0, ...persons.map((p) => Number(p.id))) + 1),
    name: body.name,
    number: body.number,
  };

  persons.push(newPerson);
  console.log("New Person added:", newPerson);

  res.status(201).json(newPerson);
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
