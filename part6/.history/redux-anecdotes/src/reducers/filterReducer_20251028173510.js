export const setFilter = (filter) => {
    return {
      type: 'filter/set',
      payload: { filter }
    }
  }
  
  const filterReducer = (state = '', action) => {
    switch (action.type) {
      case 'filter/set':
        return action.payload.filter
      default:
        return state
    }
  }
  
  export default filterReducer