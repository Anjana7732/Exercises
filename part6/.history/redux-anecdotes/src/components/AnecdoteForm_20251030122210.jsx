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
      console.log('Mutation error caught:', error)
      console.log('Error type:', typeof error)
      console.log('Error message:', error?.message)
      
      const errorMessage = error?.message || error?.toString() || 'Failed to create anecdote'
      console.log('Setting notification with message:', errorMessage)
      console.log('Notification dispatch:', notificationDispatch)
      setNotificationWithTimeout(notificationDispatch, errorMessage, 5)
      console.log('Notification set')
    }
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    const content = inputRef.current?.value?.trim()
    if (!content) return
    if (content.length < 5) {
      setNotificationWithTimeout(
        notificationDispatch,
        'too short anecdote, must have length 5 or more',
        5
      )
      return
    }
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