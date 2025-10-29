import { useRef } from 'react'
import { useDispatch } from 'react-redux'
import { createAnecdote } from '../reducers/anecdoteSlice'
import { setNotification, clearNotification } from '../reducers/notificationSlice'

const AnecdoteForm = () => {
  const dispatch = useDispatch()
  const inputRef = useRef(null)

  const handleSubmit = (e) => {
    e.preventDefault()
    const content = inputRef.current?.value?.trim()
    if (!content) return
    dispatch(createAnecdote(content))
    dispatch(setNotification(`You created '${content}'`))
    inputRef.current.value = ''
    setTimeout(() => {
      dispatch(clearNotification())
    }, 5000)
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