import { createSlice } from '@reduxjs/toolkit'

const initialState = [
  {
    id: 1,
    content: 'If it hurts, do it more often',
    votes: 0
  },
  {
    id: 2,
    content: 'Adding manpower to a late software project makes it later!',
    votes: 0
  },
  {
    id: 3,
    content: 'The first 90 percent of the code accounts for the first 90 percent of the development time...',
    votes: 0
  }
]

const generateId = () => Math.floor(Math.random() * 100000)

const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState,
  reducers: {
    voteAnecdote: (state, action) => {
        const id = action.payload
        const anecdoteToChange = state.find(a => a.id === id)
        if (anecdoteToChange) {
          anecdoteToChange.votes += 1
        }
      },
      createAnecdote: (state, action) => {
        state.push({
          id: generateId(),
          content: action.payload,
          votes: 0
        })
      }
    }
  })
  
  export const { voteAnecdote, createAnecdote } = anecdoteSlice.actions
  export default anecdoteSlice.reducer