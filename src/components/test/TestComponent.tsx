import { useState } from 'react';

export const TestComponent = () => {
  const [count, setCount] = useState(0);

  return (
    <div>
      <h1>Test Component</h1>
      <button onClick={() => setCount(count + 1)}>Count: {count}</button>
    </div>
  );
};
