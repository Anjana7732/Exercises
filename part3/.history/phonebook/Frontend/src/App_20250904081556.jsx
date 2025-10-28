import { useState, useEffect } from "react";
import "./index.css";
import Notification from "./Notification.jsx";
import * as personService from "./services/persons";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNum, setNewNum] = useState("");
  const [filter, setFilter] = useState("");
  const [notification, setNotification] = useState({ message: null, type: "" });

  // 
  useEffect(() => {
    personService.getAll().then((initialPersons) => {
      setPersons(initialPersons);
    });
  }, []);

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification({ message: null, type: "" }), 3000);
  };

  const handleClick = (e) => {
    e.preventDefault();
    const trimmedName = newName.trim();
    const trimmedNumber = newNum.trim();
    if (!trimmedName || !trimmedNumber) return;

    const existingPerson = persons.find((p) => p.name === trimmedName);

    if (existingPerson) {
      const confirm = window.confirm(
        `${trimmedName} is already added, replace old number?`
      );
      if (confirm) {
        const updatedPerson = { ...existingPerson, number: trimmedNumber };
        personService
          .update(existingPerson.id, updatedPerson)
          .then((returned) => {
            setPersons(
              persons.map((p) => (p.id !== existingPerson.id ? p : returned))
            );
            showNotification(`Updated ${trimmedName}'s number`, "success");
          })
          .catch(() => {
            showNotification(
              `Information of ${trimmedName} has already been removed from server.`,
              "error"
            );
          });
      }
      return;
    }

    // ✅ Add new person to backend
    const newPerson = { name: trimmedName, number: trimmedNumber };
    personService
      .create(newPerson)
      .then((returnedPerson) => {
        setPersons(persons.concat(returnedPerson));
        setNewName("");
        setNewNum("");
        showNotification(`Added ${trimmedName}`, "success");
      })
      .catch(() => {
        showNotification("Failed to add person", "error");
      });
  };

  const handleDel = (id, name) => {
    const confirm = window.confirm(`Delete ${name}?`);
    if (confirm) {
      personService
        .remove(id)
        .then(() => {
          setPersons(persons.filter((p) => p.id !== id));
          showNotification(`Deleted ${name}`, "success");
        })
        .catch(() => {
          showNotification(
            `Information of ${name} has already been removed from server.`,
            "error"
          );
          setPersons(persons.filter((p) => p.id !== id));
        });
    }
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={notification.message} type={notification.type} />

      <form>
        <div>
          Filter shown with:{" "}
          <input
            placeholder="search Name"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
        </div>

        <h2>Add new contacts</h2>
        <div>
          Name:{" "}
          <input
            placeholder="Add a Name"
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
          <button onClick={handleClick} type="submit">
            add
          </button>
        </div>
      </form>

      <h2>Numbers</h2>
      {persons
        .filter((p) =>
          p.name.toLowerCase().includes(filter.toLowerCase())
        )
        .map((p) => (
          <p key={p.id}>
            {p.name}: {p.number}
            <button onClick={() => handleDel(p.id, p.name)}>Delete</button>
          </p>
        ))}
    </div>
  );
};

export default App;
