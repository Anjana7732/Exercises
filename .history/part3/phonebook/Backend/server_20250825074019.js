import express from "express";
import cors from "cors";

const app = express();
const PORT = 3001;

app.use(cors());

const persons = [
  { id: "1", name: "Arto Hellas", number: "040-123456" },
  { id: "2", name: "Ada Lovelace", number: "39-44-5323523" },
  { id: "3", name: "Dan Abramov", number: "12-43-234345" },
  { id: "4", name: "Mary Poppendieck", number: "39-23-6423122" },
];


app.get("/api/persons", (request, response) => {


response.json(persons); 
});

app.get("/", (req, res) => {
  res.send("<h1>Phonebook Backend Running</h1>");
});

app.get('/info', (req, res) => {
  const count = persons.length
  const time = new Date()
  res.send(`
    <p>Phon</p>
    `)
})

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
