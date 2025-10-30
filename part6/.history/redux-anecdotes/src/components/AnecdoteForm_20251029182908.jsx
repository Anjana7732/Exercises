import { useRef } from 'react'
import { useDispatch } from 'react-redux'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createAnecdote as createAnecdoteService } from '../services/anecdotes'
import { setNotificationWithTimeout } from '../reducers/notificationSlice'

const AnecdoteForm = () => {
  const dispatch = useDispatch()
  const queryClient = useQueryClient()
  const inputRef = useRef(null)

  const createMutation = useMutation({
    mutationFn: createAnecdoteService,
    onSuccess: (newAnecdote) => {
      queryClient.invalidateQueries({ queryKey: ['anecdotes'] })
      dispatch(setNotificationWithTimeout(`new anecdote '${newAnecdote.content}'`, 5))
      inputRef.current.value = ''
    }
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    const content = inputRef.current?.value?.trim()
    if (!content) return
    createMutation.mutate(content)
  }

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <input ref={inputRef} />
        </div>
        <button>create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm