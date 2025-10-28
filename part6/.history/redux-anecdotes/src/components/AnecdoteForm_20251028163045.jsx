import { useRef } from 'react'
import { useDispatch } from 'react-redux'
import { createAnecdote } from '../reducers/anecdoteReducer'

const AnecdoteForm = () => {
  const dispatch = useDispatch()
  const inputRef = useRef(null)

  const onSubmit = (e) => {
    e.preventDefault()
    const value = inputRef.current?.value?.trim()
    if (!value) return
    dispatch(createAnecdote(value))
    inputRef.current.value = ''
  }

  return (
    <div style={{ marginTop: 16 }}>
      <h3>create new</h3>
      <form onSubmit={onSubmit}>
        <input ref={inputRef} />
        <button type="submit" style={{ marginLeft: 8 }}>create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm