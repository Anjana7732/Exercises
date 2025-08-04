import { useState } from 'react'
const App =() => {
  const anecdotes =[
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write the code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the coe in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.',
    'The only way to go fast, is to go well.'
  ]

  const [selected,setSelected] = useState(0)

  const initialVotes = {};
  for (let i=0; i<anecdotes.length; i++){
    initialVotes[i] =0;
  }
  const [vote, setVote] = useState(initialVotes);
  const labelClick =() =>{
    const randomIdx =Math.floor(Math.random()* anecdotes.length);
    setSelected(randomIdx)
  }

  const voteClick =() =>{
    setVote(prev => ({...prev,[selected]: prev[selected]+1

    }));
  };
  const maxVotes = Math.max(...Object.values(vote));
  const maxIdx = Object.keys(vote).find(key => vote[key] === maxVotes)

  return (
    <div>
      <h1>Anecdote of the day</h1>
      <p>{anecdotes[selected]}</p>
      <p>has {vote[selected] } votes.</p>
      <button onClick={voteClick}>Vote</button>
      <button onClick={labelClick} >Next Anecdote</button>
      {maxVotes>0 && (
        <>
        <h1>Anecdote with most votes</h1>
        <p>{anecdotes[maxIdx]}</p>
        <p>has {maxVotes} votes.</p>
        </>
      )}
      
   </div>
  )
}
export default App
