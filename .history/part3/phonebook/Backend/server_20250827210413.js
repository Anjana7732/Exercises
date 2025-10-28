import express from "express";
import cors from "cors";

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

let persons = [   // use let, not const
  { id: "1", name: "Arto Hellas", number: "040-123456" },
  { id: "2", name: "Ada Lovelace", number: "39-44-5323523" },
  { id: "3", name: "Dan Abramov", number: "12-43-234345" },
  { id: "4", name: "Mary Poppendieck", number: "39-23-6423122" },
];

app.get("/api/persons", (req, res) => {
  res.json(persons);
});

app.get("/api/persons/:id", (req, res) => {
  const id = req.params.id;
  const person = persons.find(p => p.id === id);
  if (person) {
    res.json(person);
  } else {
    res.status(404).end();
  }
});

app.get("/", (req, res) => {
  res.send("<h1>Phonebook Backend Running</h1>");
});

app.delete("/api/persons/:id", (req, res) => {   // fixed path
  const id = req.params.id;
  const exists = persons.some(p => p.id === id);
  if (!exists) {
    return res.status(40)
  } else {
    res.status(404).end();
  }
});

app.get("/info", (req, res) => {
  const count = persons.length;
  const times = new Date();
  res.send(`
    <p>Phonebook has info for ${count} people</p>
    <p>${times}</p>
  `);
});

app.post("/api/persons", (req, res) => {
  const body = req.body;
  if (!body.name || !body.number) {
    return res.status(400).json({ error: "Either name or number missing" });
  }
  if (persons.find(p => p.name === body.name)) {
    return res.status(400).json({ error: "name must be unique" });
  }
  const newPerson = {
    id: String(Math.floor(Math.random() * 1000000)),
    name: body.name,
    number: body.number,
  };
  persons.push(newPerson);   // fixed typo
  res.json(newPerson);
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
