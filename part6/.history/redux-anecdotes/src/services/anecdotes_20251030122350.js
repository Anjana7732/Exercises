const baseUrl = 'http://localhost:3001/anecdotes'

export const getAnecdotes = async () => {
  const response = await fetch(baseUrl)
  if (!response.ok) {
    throw new Error('Failed to fetch anecdotes')
  }
  return await response.json()
}

export const createAnecdote = async (content) => {
  if (typeof content === 'string' && content.trim().length < 5) {
    throw new Error('too short anecdote, must have length 5 or more')
  }
  const response = await fetch(baseUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ content, votes: 0 })
  })
  
  // Check if response is ok (status 200-299)
  if (!response.ok) {
    let errorMessage = 'Failed to create anecdote'
    
    // Clone response to read body multiple times if needed
    const contentType = response.headers.get('content-type') || ''
    const isJson = contentType.includes('application/json')
    
    try {
      if (isJson) {
        // Try to parse as JSON
        const errorData = await response.json()
        console.log('Error response data:', errorData)
        
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
      } else {
        // If not JSON, try to get text
        const text = await response.text()
        if (text) errorMessage = text
      }
    } catch (parseError) {
      console.error('Error parsing error response:', parseError)
    }
    
    console.log('Throwing error with message:', errorMessage)
    throw new Error(errorMessage)
  }
  
  const data = await response.json()
  return data
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
