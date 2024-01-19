import React from './core/React.js';

function Foo() {
  const [count, setCount] = React.useState(10);
  const [bar, setBar] = React.useState('bar');
  function handleClick() {
    setCount(10)
    // setBar(bar => bar + 'bar');
  }
  return (
    <div>
      <h1>foo</h1>
      {count}
      {bar}
      <button onClick={handleClick}>add</button>
    </div>
  )
}

const App = () => {
  return (
    <div>
      App
      <Foo></Foo>
    </div>
  )
};

export default App