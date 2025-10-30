import { useRef } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createAnecdote as createAnecdoteService } from '../services/anecdotes'
import { useNotificationDispatch, setNotificationWithTimeout } from '../NotificationContext'

const AnecdoteForm = () => {
  const notificationDispatch = useNotificationDispatch()
  const queryClient = useQueryClient()
  const inputRef = useRef(null)

  const createMutation = useMutation({
    mutationFn: createAnecdoteService,
    onSuccess: (newAnecdote) => {
      queryClient.invalidateQueries({ queryKey: ['anecdotes'] })
      setNotificationWithTimeout(notificationDispatch, `new anecdote '${newAnecdote.content}'`, 5)
      inputRef.current.value = ''
    },
    onError: (error) => {
      // Extract error message - React Query passes Error object
      const errorMessage = error?.message || 'Failed to create anecdote'
      setNotificationWithTimeout(notificationDispatch, errorMessage, 5)
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