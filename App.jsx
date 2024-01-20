import React from './core/React.js';

function Foo() {
  const [count, setCount] = React.useState(10);
  const [bar, setBar] = React.useState('bar');
  function handleClick() {
    setCount(count => count + 1)
    // setBar(bar => bar + 'bar');
  }

  React.useEffect(() => {
    console.log('effect1');
    return () => {
      console.log('effect1 return')
    }

  }, [1])
  React.useEffect(() => {
    console.log('effect2')
    return () => {
      console.log('effect2 return')
    }
  }, [count])
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