// Reducer for anecdotes

const initialState = [
    { id: 1, content: 'If it hurts, do it more often', votes: 0 },
    { id: 2, content: 'Adding manpower to a late software project makes it later!', votes: 0 },
    { id: 3, content: 'Premature optimization is the root of all evil.', votes: 0 }
  ]
  
  // Action creators
  export const voteAnecdote = (id) => {
    return {
      type: 'VOTE',
      payload: { id }
    }
  }
  
  export const addAnecdote = (content) => {
    return {
      type: 'NEW_ANECDOTE',
      payload: {
        id: Math.floor(Math.random() * 100000),
        content,
        votes: 0
      }
    }
  }
  
  // Reducer function
  const anecdoteReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'VOTE':
        return state.map(a =>
          a.id === action.payload.id
            ? { ...a, votes: a.votes + 1 }
            : a
        )
  
      case 'NEW_ANECDOTE':
        return [...state, action.payload]
  
      default:
        return state
    }
  }
  
  export default anecdoteReducer
  