import { createContext, useReducer, useContext } from 'react'

const NotificationContext = createContext()

// Reducer: handles setting and clearing notifications
const notificationReducer = (state, action) => {
  switch (action.type) {
    case 'SET':
      return action.payload
    case 'CLEAR':
      return ''
    default:
      return state
  }
}

// Provider component
export const NotificationContextProvider = ({ children }) => {
  const [notification, dispatch] = useReducer(notificationReducer, '')

  return (
    <NotificationContext.Provider value={[notification, dispatch]}>
      {children}
    </NotificationContext.Provider>
  )
}

// Hooks for components to use
export const useNotificationValue = () => {
  const [notification] = useContext(NotificationContext)
  return notification
}

export const useNotificationDispatch = () => {
  const [, dispatch] = useContext(NotificationContext)
  return dispatch
}

// Utility function: sets a notification and clears it after `seconds`
export const setNotificationWithTimeout = (dispatch, message, seconds) => {
  dispatch({ type: 'SET', payload: message })

  // Clear existing timeout if needed (optional)
  setTimeout(() => {
    dispatch({ type: 'CLEAR' })
  }, seconds * 1000)
}
