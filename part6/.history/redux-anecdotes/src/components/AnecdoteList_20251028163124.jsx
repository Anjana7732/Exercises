import { useDispatch, useSelector } from 'react-redux'
import { voteAnecdote } from '../reducers/anecdoteReducer'

const AnecdoteList = () => {
  const dispatch = useDispatch()
  const anecdotes = useSelector(state =>
    [...state].sort((a, b) => b.votes - a.votes)
  )

  return (
    <div>
      {anecdotes.map(a => (
        <div key={a.id} style={{ marginBottom: 12 }}>
          <div>{a.content}</div>
          <div>
            has {a.votes}{' '}
            <button onClick={() => dispatch(voteAnecdote(a.id))}>
              vote
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default AnecdoteList