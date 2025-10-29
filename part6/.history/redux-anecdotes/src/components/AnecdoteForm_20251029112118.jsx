import { useRef } from 'react'
import { useDispatch } from 'react-redux'
import { createAnecdote } from '../reducers/anecdoteSlice'
import { setNotificationWithTimeout } from '../reducers/notificationSlice'

const AnecdoteForm = () => {
  const dispatch = useDispatch()
  const inputRef = useRef(null)

  const handleSubmit = (e) => {
    e.preventDefault()
    const content = inputRef.current?.value?.trim()
    if (!content) return
    dispatch(createAnecdote(content))
    dispatch(setNotificationWithTimeout(`new anecdote '${content}'`, 5))
    inputRef.current.value = ''
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