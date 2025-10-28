import React from 'react'
import ReactDOM from 'react-dom/client'
import { createStore } from 'redux'
import counterReducer from './reducer'

const store = createStore(counterReducer)
const root = ReactDOM.createRoot(document.getElementById('root'))

// Render function — always reads the latest state
const render = () => {
  const { good, ok, bad } = store.getState()

  root.render(
    <div style={{ padding: 16 }}>
      <div style={{ marginBottom: 12 }}>
        <button onClick={() => store.dispatch({ type: 'GOOD' })}>good</button>
        <button onClick={() => store.dispatch({ type: 'OK' })} style={{ marginLeft: 8 }}>ok</button>
        <button onClick={() => store.dispatch({ type: 'BAD' })} style={{ marginLeft: 8 }}>bad</button>
        <button onClick={() => store.dispatch({ type: 'RESET' })} style={{ marginLeft: 8 }}>reset stats</button>
      </div>

      <div>good {good}</div>
      <div>ok {ok}</div>
      <div>bad {bad}</div>
    </div>
  )
}

render()
store.subscribe(render)
