import { useState } from 'react'

const Button =({ handleClick, text}) => (
  <button onClick ={handleClick}>{text}</button>
)

const State = ({text, value}) => (
  <tr>
    <td>{text}</td>
    <td>{value}</td>
  </tr>
)

const Statistics =({good, neutral, bad}) => {
  const total = good + neutral + bad;
  const average = total ? (good-bad)/total :0
  const positive = total? (good/total)*100 :0

  if (total === 0) {
    return <p>No feedback given</p>
  }

  return (
    <table>
      <tbody>
        <State text="good" value ={good} />
        <State text="neutral" value ={neutral} />
        <State text="bad" value ={bad} />
        <State text="all" value ={total} />
        <State text="average" value ={average} />
        <State text="positive" value ={positive} />
      </tbody>
    </table>
  )
}
const App =() => {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  return (
    <div>
      <h1>Give Feedback</h1>
      <Button handleClick={() => setGood(good +1)} text="good" />
      <Button handleClick={() => setNeutral(neutral +1)} text="neutral" />
      <Button handleClick={() => setBad(bad +1)} text="bad" />

      <h2>Statistics</h2>
      <Statistics good={good} neutral={neutral} bad={bad} />

    </div>
  )
}

export default App
