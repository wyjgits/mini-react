import React from './core/React.js';
let count = 0;
let showDiv = false;

const Bar =  <div>
    div
    <span>bar</span>
    <span>dd</span>
  </div>
const Foo = <div>foo</div>
const Counter = () => {
  console.log('counter')
  const update = React.update();
  function clickFn() {
    showDiv = !showDiv;
    update();
  }
  return <div>
    111
    {showDiv && 'counter'}
    <button onClick={clickFn}>add</button>
  </div>
}
const Counter2 = () => {
  console.log('counter2')
  return <div>
    222
  </div>

}
const App = () => {
  return (
    <div>
      App
      <Counter num="2"></Counter>222
      <Counter2></Counter2>333
    </div>
  )
};

export default App