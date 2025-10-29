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

const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState: [],
  reducers: {
    voteAnecdote: (state, action) => {
      const id = action.payload
      const anecdoteToChange = state.find(a => a.id === id)
      if (anecdoteToChange) {
        anecdoteToChange.votes += 1
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAnecdotes.fulfilled, (state, action) => {
        return action.payload
      })
      .addCase(createAnecdote.fulfilled, (state, action) => {
        state.push(action.payload)
      })
  }
})
  
export const { voteAnecdote } = anecdoteSlice.actions
export default anecdoteSlice.reducer