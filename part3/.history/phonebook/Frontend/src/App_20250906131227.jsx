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

  const handleClick =(e) 
}