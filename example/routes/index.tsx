import { Counter } from '../components/Counter.tsx'

export async function get(params: Params) {
  return {
    message: params.greeting || 'Hello World'
  }
}

export function html(data: Data) {
  return (
    <html>
      <head>
        <link rel="icon" href="/favicon.svg" />
      </head>
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

interface Params {
  greeting: string
}

interface Data {
  message: string
}
