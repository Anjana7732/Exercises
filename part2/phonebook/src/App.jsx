import { useState } from 'react'

const App =() =>{
  const [persons, setPersons] =useState([
    {
      name: 'Arto Hellas',
      number: '39-44-5323523'
    }
  ])
  const [newName, setNewName] = useState('')
  const [newNum, setNewNum] =useState('')
  const [filter, setFilter] = useState('')
  const handleClick =(e) => {
    e.preventDefault();
    const trimmedName = newName.trim();
    const trimmedNumber = newNum.trim();
    if(trimmedName === '' || trimmedNumber==='') return ;

    if(persons.some(person => person.name === trimmedName)){
      alert(`${trimmedName} is already added to phonebook` )
      return;
    }

    const newPerson ={name: trimmedName, number: trimmedNumber}
    setPersons([...persons, newPerson])
    setNewName('')
    setNewNum('')
  }
  // const filteredPersons =persons.filter(person =>
  //   person.name.toLowerCase().includes(filter.toLowerCase())
  // );
  return (
    <div>
      <h2>Phonebook</h2>
      <form>
        <div>
          Filter shown with: 
          <input placeholder='search Name'
          value={filter}
          onChange={(e) => setFilter(e.target.value)}/>
        </div>
        <h2>Add new contacts</h2>
        <div>
          Name : <input placeholder='Add a Name'
          value={newName}
          onChange = {(e) => {setNewName(e.target.value)}}/>
        </div>
        <div>
          Number : <input placeholder='Add number'
          value={newNum}
          onChange = {(e) => {setNewNum(e.target.value)}}/>
        </div>
        <div>
          <button onClick={handleClick} type ="submit">add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      {persons
      .filter(person =>
        person.name.toLowerCase().includes(filter.toLowerCase()))
      .map((person,index) =>
      <p key ={index} >{person.name} {person.number}</p> 
      
      )}
      
    </div>
  )
}
export default App