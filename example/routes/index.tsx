import { useState } from 'react';
import { Request } from '../../src'

export async function get(request: Request) {
  return {
    message: request.query.get<string>('greeting') || 'Hello World'
  }
}

export function html(data: Data) {
  return (
    <html>
      <body>
        <p>{data.message + '!'}</p>
        <Counter />
      </body>
    </html>
  )
}

export function Counter() {
  const [count, setCount] = useState(0)
  return (
    <button onClick={() => setCount(count + 1)}>
      You clicked me {count} times
    </button>
  );
}

export function json(data: Data) {
  return { message: `${data.message}!` }
}

interface Data {
  message: string
}
