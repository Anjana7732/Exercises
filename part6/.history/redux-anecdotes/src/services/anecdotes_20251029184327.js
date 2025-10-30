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
      const contentType = response.headers.get('content-type')
      if (contentType && contentType.includes('application/json')) {
        const errorData = await response.json()
        // JSON Server might return error in different formats
        errorMessage = errorData.error || errorData.message || errorMessage
        
        // Handle validation errors from JSON Server middleware
        if (errorData.errors) {
          const errors = errorData.errors
          if (typeof errors === 'object') {
            // Extract first error message
            const firstError = Object.values(errors)[0]
            if (Array.isArray(firstError)) {
              errorMessage = firstError[0]
            } else if (typeof firstError === 'string') {
              errorMessage = firstError
            }
          }
        }
      } else {
        // If response isn't JSON, try to get text
        errorMessage = await response.text() || errorMessage
      }
    } catch (parseError) {
      // If we can't parse at all, use default message
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
