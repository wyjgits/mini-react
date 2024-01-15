import React from './core/React.js';
const Counter = (props) => {
  console.log('props',props)
  return <div>counter: {props.num}</div>
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