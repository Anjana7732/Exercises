import { createSlice } from '@reduxjs/toolkit'
import { createAsyncThunk } from '@reduxjs/toolkit'

const baseUrl = 'http://localhost:3001/anecdotes'

export const fetchAnecdotes = createAsyncThunk(
  'anecdotes/fetchAll',
  async () => {
    const response = await fetch(baseUrl)
    return await response.json()
  }
)

export const createAnecdote = createAsyncThunk(
  'anecdotes/createNew',
  async (content) => {
    const response = await fetch(baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content, votes: 0 })
    })
    return await response.json()
  }
)

export const voteAnecdote = createAsyncThunk(
  'anecdotes/vote',
  async (anecdote) => {
    const updatedAnecdote = { ...anecdote, votes: anecdote.votes + 1 }
    const response = await fetch(`${baseUrl}/${anecdote.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedAnecdote)
    })
    return await response.json()
  }
)

const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState: [],
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAnecdotes.fulfilled, (state, action) => {
        return action.payload
      })
      .addCase(createAnecdote.fulfilled, (state, action) => {
        state.push(action.payload)
      })
      .addCase(voteAnecdote.fulfilled, (state, action) => {
        const updatedAnecdote = action.payload
        return state.map(anecdote => 
          anecdote.id === updatedAnecdote.id ? updatedAnecdote : anecdote
        )
      })
  }
})
  
export const {} = anecdoteSlice.actions
export default anecdoteSlice.reducer