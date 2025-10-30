const baseUrl = 'http://localhost:3001/anecdotes'

export const getAnecdotes = async () => {
  const response = await fetch(baseUrl)
  if (!response.ok) {
    throw new Error('Failed to fetch anecdotes')
  }
  return await response.json()
}

export const createAnecdote = async (content) => {
  const response = await fetch(baseUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ content, votes: 0 })
  })
  if (!response.ok) {
    let errorMessage = 'Failed to create anecdote'
    try {
      const errorData = await response.json()
      // JSON Server might return error in different formats
      // Try common error message fields
      if (errorData.error) {
        errorMessage = errorData.error
      } else if (errorData.message) {
        errorMessage = errorData.message
      } else if (errorData.errors) {
        // Handle validation errors object
        const errors = errorData.errors
        if (typeof errors === 'object' && errors !== null) {
          // Get first error value
          const errorValues = Object.values(errors)
          if (errorValues.length > 0) {
            const firstError = errorValues[0]
            if (Array.isArray(firstError) && firstError.length > 0) {
              errorMessage = firstError[0]
            } else if (typeof firstError === 'string') {
              errorMessage = firstError
            }
          }
        }
      }
    } catch (parseError) {
      // If response isn't JSON, use default message
      console.error('Error parsing error response:', parseError)
    }
    throw new Error(errorMessage)
  }
  return await response.json()
}

export const updateAnecdote = async (anecdote) => {
  const updatedAnecdote = { ...anecdote, votes: anecdote.votes + 1 }
  const response = await fetch(`${baseUrl}/${anecdote.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updatedAnecdote)
  })
  if (!response.ok) {
    throw new Error('Failed to update anecdote')
  }
  return await response.json()
}
