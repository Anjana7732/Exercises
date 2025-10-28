import { useState, useEffect } from "react";
import axios from "axios";
import "./index.css";
impoo

const baseUrl = "http://localhost:3001/api/persons"; 

const Notification = ({ message, type }) => {
  if (!message) return null;
  return (
    <div className={type === "error" ? "error" : "success"}>
      {message}
    </div>
  );
};

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNum, setNewNum] = useState("");
  const [filter, setFilter] = useState("");
  const [notification, setNotification] = useState({ message: null, type: "" });

  
  useEffect(() => {
    axios
      .get(baseUrl)
      .then((res) => setPersons(res.data))
      .catch((err) => console.error("Error fetching people:", err));
  }, []);

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    
  };

  const handleClick = (e) => {
    e.preventDefault();
    const trimmedName = newName.trim();
    const trimmedNumber = newNum.trim();
    if (!trimmedName || !trimmedNumber) return;

    
    const existing = persons.find((p) => p.name === trimmedName);
    if (existing) {
      const conf = window.confirm(
        `${trimmedName} is already in phonebook. Replace number?`
      );
      if (conf) {
        axios
          .put(`${baseUrl}/${existing._id}`, {
            name: trimmedName,
            number: trimmedNumber,
          })
          .then((res) => {
            setPersons(
              persons.map((p) => (p._id === existing._id ? res.data : p))
            );
            showNotification(`Updated ${trimmedName}'s number`);
          })
          .catch(() => {
            showNotification(
              `Information of ${trimmedName} has already been removed from server.`,
              "error"
            );
            setPersons(persons.filter((p) => p._id !== existing._id));
          });
      }
      return;
    }

    
    const newPerson = { name: trimmedName, number: trimmedNumber };
    axios
      .post(baseUrl, newPerson)
      .then((res) => {
        setPersons([...persons, res.data]);
        setNewName("");
        setNewNum("");
        showNotification(`Added ${trimmedName}`);
      })
      .catch((err) => {
        console.error(err);
        showNotification("Error adding person", "error");
      });
  };

  const handleDel = (id, name) => {
    if (window.confirm(`Delete ${name}?`)) {
      axios
        .delete(`${baseUrl}/${id}`)
        .then(() => {
          setPersons(persons.filter((p) => p._id !== id));
          showNotification(`Deleted ${name}`);
        })
        .catch(() => {
          showNotification(
            `Information of ${name} has already been removed from server.`,
            "error"
          );
          setPersons(persons.filter((p) => p._id !== id));
        });
    }
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={notification.message} type={notification.type} />

      <div>
        Filter shown with:{" "}
        <input
          placeholder="Search name"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
      </div>

      <h2>Add new contact</h2>
      <form onSubmit={handleClick}>
        <div>
          Name:{" "}
          <input
            placeholder="Add a name"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />
        </div>
        <div>
          Number:{" "}
          <input
            placeholder="Add number"
            value={newNum}
            onChange={(e) => setNewNum(e.target.value)}
          />
        </div>
        <div>
          <button type="submit">Add</button>
        </div>
      </form>

      <h2>Numbers</h2>
      {persons
        .filter((p) =>
          p.name.toLowerCase().includes(filter.toLowerCase())
        )
        .map((p) => (
          <p key={p._id}>
            {p.name}: {p.number}
            <button onClick={() => handleDel(p._id, p.name)}>Delete</button>
          </p>
        ))}
    </div>
  );
};

export default App;
