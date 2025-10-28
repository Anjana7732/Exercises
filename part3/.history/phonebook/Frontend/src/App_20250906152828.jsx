import { useState, useEffect } from "react";
import axios from "axios";
import Notification from "./Notification"; 
import "./index.css";

const baseUrl = "http://localhost:3001/api/persons";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNum, setNewNum] = useState("");
  const [filter, setFilter] = useState("");
  const [notification, setNotification] = useState({ message: null, type: "" });

  useEffect(() => {
    axios.get(baseUrl).then((res) => setPersons(res.data));
  }, []);

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification({ message: null, type: "" }), 5000);
  };

  const handleClick = (e) => {
    e.preventDefault();
    const trimmedName = newName.trim();
    const trimmedNumber = newNum.trim();
    if (!trimmedName || !trimmedNumber) return;

    const existing = persons.find((p) => p.name === trimmedName);

    if (existing) {
      if (window.confirm(`${trimmedName} exists. Replace number?`)) {
        axios
          .put(`${baseUrl}/${existing.id}`, {
            name: trimmedName,
            number: trimmedNumber,
          })
          .then((res) => {
            setPersons(persons.map((p) => (p.id === existing.id ? res.data : p)));
            showNotification(`Updated ${trimmedName}'s number`, "success");
          })
          .catch(() => {
            showNotification(`Error updating ${trimmedName}`, "error");
          });
      }
      return;
    }

    axios
      .post(baseUrl, { name: trimmedName, number: trimmedNumber })
      .then((res) => {
        setPersons([...persons, res.data]);
        setNewName("");
        setNewNum("");
        showNotification(`Added ${trimmedName}`, "success");
      })
      .catch(() => {
        showNotification("Error adding person", "error");
      });
  };

  const handleDel = (id, name) => {
    if (window.confirm(`Delete ${name}?`)) {
      axios
        .delete(`${baseUrl}/${id}`)
        .then(() => {
          setPersons(persons.filter((p) => p.id !== id));
          showNotification(`Deleted ${name}`, "success");
        })
        .catch(() => {
          showNotification(`Error deleting ${name}`, "error");
        });
    }
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={notification.message} type={notification.type} />

      <div>
        Filter:{" "}
        <input
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
      </div>

      <h2>Add contact</h2>
      <form onSubmit={handleClick}>
        <div>
          Name:{" "}
          <input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />
        </div>
        <div>
          Number:{" "}
          <input
            value={newNum}
            onChange={(e) => setNewNum(e.target.value)}
          />
        </div>
        <button type="submit">Add</button>
      </form>

      <h2>Numbers</h2>
      {persons
        .filter((p) => p.name.toLowerCase().includes(filter.toLowerCase()))
        .map((p) => (
          <p key={p.id}>
            {p.name}: {p.number}{" "}
            <button onClick={() => handleDel(p.id, p.name)}>Delete</button>
          </p>
        ))}
    </div>
  );
};

export default App;
