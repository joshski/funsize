import { Request } from '../../src'
import { Counter } from '../components/Counter.tsx'

export async function get(request: Request) {
  return {
    message: request.query.get('greeting') || 'Hello World'
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

export function json(data: Data) {
  return { message: `${data.message}!` }
}

interface Data {
  message: string
}
