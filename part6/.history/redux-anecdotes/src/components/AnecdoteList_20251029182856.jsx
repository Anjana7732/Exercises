import { useSelector } from 'react-redux'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getAnecdotes, updateAnecdote } from '../services/anecdotes'
import { setNotificationWithTimeout } from '../reducers/notificationSlice'
import { useDispatch } from 'react-redux'

const AnecdoteList = () => {
  const dispatch = useDispatch()
  const filter = useSelector(state => state.filter || '')
  const queryClient = useQueryClient()

  const result = useQuery({
    queryKey: ['anecdotes'],
    queryFn: getAnecdotes,
    retry: false
  })

  const voteMutation = useMutation({
    mutationFn: updateAnecdote,
    onSuccess: (updatedAnecdote) => {
      queryClient.invalidateQueries({ queryKey: ['anecdotes'] })
      dispatch(setNotificationWithTimeout(`you voted '${updatedAnecdote.content}'`, 10))
    }
  })

  if (result.isLoading) {
    return <div>loading anecdotes...</div>
  }

  if (result.isError) {
    return (
      <div>
        <h2>Anecdote service not available due to problems in server</h2>
        <p>Error: {result.error.message}</p>
      </div>
    )
  }

  const anecdotes = result.data || []
  const filteredAnecdotes = anecdotes.filter(anecdote =>
    anecdote.content.toLowerCase().includes(filter.toLowerCase())
  )

  const sortedAnecdotes = [...filteredAnecdotes].sort((a, b) => b.votes - a.votes)

  const handleVote = (anecdote) => {
    voteMutation.mutate(anecdote)
  }

  return (
    <div>
      {sortedAnecdotes.map(anecdote => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes} <button onClick={() => handleVote(anecdote)}>vote</button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default AnecdoteList