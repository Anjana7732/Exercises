import express from "express";
import cors from "cors";

const app = express();
const PORT = 3001;

// Enable CORS so frontend can fetch data
app.use(cors());

// Sample data
const persons = [
  { id: "1", name: "Arto Hellas", number: "040-123456" },
  { id: "2", name: "Ada Lovelace", number: "39-44-5323523" },
  { id: "3", name: "Dan Abramov", number: "12-43-234345" },
  { id: "4", name: "Mary Poppendieck", number: "39-23-6423122" },
];

// GET endpoint
app.get("/api/persons", (req, res) => {
console.log(persons);
res.json(persons); // <
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
