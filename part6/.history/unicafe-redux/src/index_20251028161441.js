import { useState } from 'react';

const App = () => {
  // Step 1: State for each type of feedback
  const [good, setGood] = useState(0);
  const [ok, setOk] = useState(0);
  const [bad, setBad] = useState(0);

  // Step 2: Event handlers to update the counts
  const handleGood = () => setGood(good + 1);
  const handleOk = () => setOk(ok + 1);
  const handleBad = () => setBad(bad + 1);

  return (
    <div>
      <h1>Give Feedback</h1>
      <button onClick={handleGood}>Good</button>
      <button onClick={handleOk}>Ok</button>
      <button onClick={handleBad}>Bad</button>

      <h2>Statistics</h2>
      <p>Good: {good}</p>
      <p>Ok: {ok}</p>
      <p>Bad: {bad}</p>
    </div>
  );
};

export default App;
