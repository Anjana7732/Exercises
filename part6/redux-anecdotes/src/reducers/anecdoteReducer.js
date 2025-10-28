const initialAnecdotes = [
  'If it hurts, do it more often.',
  'Adding manpower to a late software project makes it later!',
  'The first 90 percent of the code accounts for the first 90 percent of the development time...'
].map((content, idx) => ({
  id: String(idx + 1),
  content,
  votes: 0
}))

const generateId = () => Math.random().toString(36).slice(2, 9)

export const voteAnecdote = (id) => {
  return {
    type: 'anecdotes/vote',
    payload: { id }
  }
}

export const createAnecdote = (content) => {
  return {
    type: 'anecdotes/create',
    payload: { id: generateId(), content, votes: 0 }
  }
}

const anecdoteReducer = (state = initialAnecdotes, action) => {
  switch (action.type) {
    case 'anecdotes/vote': {
      const { id } = action.payload
      return state.map(a => a.id === id ? { ...a, votes: a.votes + 1 } : a)
    }
    case 'anecdotes/create': {
      const { id, content, votes } = action.payload
      return state.concat({ id, content, votes })
    }
    default:
      return state
  }
}

export default anecdoteReducer