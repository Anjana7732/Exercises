import { createStore } from 'redux'
import anecdoteReducer from './reducers/anecdoteReducer'
import filterReducer from './reducers/filterReducer'
const store = createStore(anecdoteReduce)

export default store