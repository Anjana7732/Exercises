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

