// Reducer for filtering anecdotes by text

const initialState = ''

export const setFilter = (filterText) => {
  return {
    type: 'SET_FILTER',
    payload: filterText
  }
}

const filterReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_FILTER':
      return action.payload
    default:
      return state
  }
}

export default filterReducer
