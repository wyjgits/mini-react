import React from "./core/React"


function Counter({num}) {
  return <div>counter: {num}</div>
}

function CounterContainer({num}) {
  return <div style="background: gray;">counter-container:{num}
    <Counter num={num+1}></Counter>
  </div>
}

function App() {
  return <div id="main">
    <span style="color: #f0f">
      success:
      </span>
      hello world
      <CounterContainer num={2}></CounterContainer>
      <Counter num={5}></Counter>
    </div>
}

export default App;