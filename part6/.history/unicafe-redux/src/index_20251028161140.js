import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider, useDispatch, useSelector } from 'react-redux'
import { createStore } from 'redux'
import counterReducer from './reducer'

const store = createStore(counterReducer)

const App = () => {
  const dispatch = useDispatch()
  const { good, ok, bad } = useSelector(state => state)

  return (
    <div style={{ padding: 16 }}>
      <div style={{ marginBottom: 12 }}>
        <button onClick={() => dispatch({ type: 'GOOD' })}>good</button>
        <button onClick={() => dispatch({ type: 'OK' })} style={{ marginLeft: 8 }}>ok</button>
        <button onClick={() => dispatch({ type: 'BAD' })} style={{ marginLeft: 8 }}>bad</button>
        <button onClick={() => dispatch({ type: 'RESET' })} style={{ marginLeft: 8 }}>reset stats</button>
      </div>

      <div>good {good}</div>
      <div>ok {ok}</div>
      <div>bad {bad}</div>
    </div>
  )
}

const root = ReactDOM.createRoot(document.getElementById('root'))

root.render(
  <Provider store={store}>
    <App />
  </Provider>
)
