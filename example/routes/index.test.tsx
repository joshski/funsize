import { it, render } from '../../src/testing/test.ts'
import { Counter } from '../components/Counter.tsx'
import * as route from './index.tsx'

it('renders html', async () => {
  const html = await render.html(route)
  html.shouldEqual(
    <html>
      <head>
        <link rel="icon" href="/favicon.svg"/>
      </head>
      <body>
        <p>Hello World!</p>
        <Counter />
      </body>
    </html>
  )
})

it('renders html with a query string', async () => {
  const html = await render.html(route, { greeting: 'howdy' })
  html.shouldEqual(
    <html>
      <head>
        <link rel="icon" href="/favicon.svg"/>
      </head>
      <body>
        <p>howdy!</p>
        <Counter />
      </body>
    </html>
  )
})

it('renders json', async () => {
  const json = await render.json(route)
  json.shouldEqual({ message: 'Hello World!' })
})

it('renders json with a query string', async () => {
  const json = await render.json(route, { greeting: 'hola' })
  json.shouldEqual({ message: 'hola!' })
})
