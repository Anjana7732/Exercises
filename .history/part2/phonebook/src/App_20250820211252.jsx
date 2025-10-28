import { useState, useEffect } from 'react'
import peopleData from './db.json'
import './index.css'
import Notification from './Notification.jsx'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNum, setNewNum] = useState('')
  const [filter, setFilter] = useState('')
  const [notification, setNotification] = useState({ message: null, type: '' })

  useEffect(() => {
    setPersons(peopleData.persons);
  }, []);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    
  };

  const handleClick = (e) => {
    e.preventDefault();
    const trimmedName = newName.trim();
    const trimmedNumber = newNum.trim();
    if (trimmedName === '' || trimmedNumber === '') return;

    if (persons.some(person => person.name === trimmedName && person.number === trimmedNumber)) {
      showNotification(`${trimmedName} is already added to phonebook`, 'error');
      return;
    }

    if (persons.some(person => person.name === trimmedName && person.number !== trimmedNumber)) {
      const conf = window.confirm(`${trimmedName} is already added, replace old number?`);
      if (conf) {
        const updatedOne = persons.map(person =>
          person.name === trimmedName ?
            { ...person, number: trimmedNumber } : person
        )
        setPersons(updatedOne)
        setNewName('')
        setNewNum('')
        showNotification(`Updated ${trimmedName}'s number`, 'success')
        return;
      }
    }

    const newPerson = { id: Date.now(), name: trimmedName, number: trimmedNumber }
    setPersons([...persons, newPerson])
    setNewName('')
    setNewNum('')
    showNotification(`Added ${trimmedName}`, 'success')
  }

  const handleDel = (id, name) => {
    const confirm = window.confirm(`Delete ${name}?`)
    if (confirm) {
      const updated = persons.filter(person => person.id !== id)
      setPersons(updated)
      showNotification(`Information of ${name} has a.`, 'error')
    }
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={notification.message} type={notification.type} />

      <form>
        <div>
          Filter shown with:
          <input
            placeholder='search Name'
            value={filter}
            onChange={(e) => setFilter(e.target.value)} />
        </div>

        <h2>Add new contacts</h2>
        <div>
          Name: {' '}
          <input
            placeholder='Add a Name'
            value={newName}
            onChange={(e) => setNewName(e.target.value)} />
        </div>
        <div>
          Number: {' '}
          <input
            placeholder='Add number'
            value={newNum}
            onChange={(e) => setNewNum(e.target.value)} />
        </div>
        <div>
          <button onClick={handleClick} type="submit">add</button>
        </div>
      </form>

      <h2>Numbers</h2>
      {persons
        .filter(person =>
          person.name.toLowerCase().includes(filter.toLowerCase()))
        .map((person) =>
          <p key={person.id}>
            {person.name}: {person.number}
            <button onClick={() => handleDel(person.id, person.name)}>Delete</button>
          </p>
        )}
    </div>
  )
}

export default App
