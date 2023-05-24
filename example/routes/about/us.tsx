import { Counter } from "../../components/Counter.tsx"

export async function get() {
  return {
    heading: 'About us',
    contents: 'About us text...'
  }
}

export function html(data: Data) {
  return (
    <html>
      <head>
        <link rel="icon" href="/favicon.svg" />
      </head>
      <body>
        <h1>{data.heading}</h1>
        <p>{data.contents}</p>
        <p>
          <Counter />
        </p>
      </body>
    </html>
  )
}

interface Data {
  heading: string,
  contents: string
}
