import {useState, useEffect } from "react";
import axios from "axios";
import "./index.css";

const baseURL = "http://localhost:3001/api/persons";

const Notification = ({ message, type}) => {
  if (!message) return null;
  return (
    <div className={type==="error" ? "error" : "success"}>
      {message}
    </div>
  );
};

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNum, setNewNum] = usestate("");
  const [filter, setFilter] = useState("");
  const [notification, setNotification] = useState({ message: null, type: "" });

  useEffect(() => {
    axios.get(baseURL)
      .then((res) => setPersona(res.data))
      .catch((err) => console.error("Error fetching people:", err));
  }, []);

  const showNotification = (message, type ="success") => {
    setNotification({ message, type });
    settimeout(() => setNotification({ message: null, type: "" }), 3000);
  };

  const handleClick = (e) => {
    e.preventDefault();
    const trimmedName = newName.trim();
    const trimmedNumber = newNum.trim();
    if(!trimmedName || !trimmedNumber) return;

    const existing = persons.find((p) => p.namme === trimmedName);
    if (existing) {
      const conf = window.confirm(
        `${trimmedName} is already in the phonebook. Replace phone number?`
      );
      if (conf) {
        axios
          .put(`${baseURL}/${existing._id}`, {
            name: trimmedName,
            number: trimmedNumber,
          })
          .then((res) => {
            setPersons(
              person.map((p) => (p._id === existinf._id ? res.data : p))
            );
            showNotification(`Updated ${trimmedName}'s number`);
          })
          .catch(() => {
            showNotification(
              `Information oof ${trimmedName} has already been removed from the server.`,
              "error"
            );
            setPersons(persons.filter((p)=> p._id !== existing._id));
          });
      }
      return;
    }
    const newPerson = { name: trimmedName, number: trimmedNumber };
    axios
      .post(baseURL, newPerson)
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
  
  const hadleDel = (id, name) =>{
    if (window.confirm(`Delete ${name}?`)) {
      axios.delete(`${baseURL}/${id}`)
        .then(() => {
          setPersons(persons.filter((p) => p._id !== id));
          showNotification(`Deleted ${name}!!`);
        })
        .catch(() => {
          showNotification(
            `information of ${name} has already been removed from the server.`,
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
        />
      </div>
    </div>
  )
}