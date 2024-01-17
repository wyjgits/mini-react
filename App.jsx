import React from './core/React.js';
let count = 0;
const Counter = () => {
  const clickFn = () => {
    count++;
    React.update()
  }
  return <div>
    counter: {count}
    <button onClick={clickFn}>add</button>
  </div>
}
const CounterContainer = () => {
  return <Counter num={3}></Counter>
}
const App = () => {
  return (
    <div>
      App
      <span>span</span>
      <div>
        div
        <span>span</span>
      </div>
      <Counter num="2"></Counter>
      <CounterContainer />
    </div>
  )
};

export default App