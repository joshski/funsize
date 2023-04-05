import { it, render } from '../../src/test.ts'
import * as route from './index.tsx'

it('renders html', async () => {
  const html = await render.html(route)
  html.shouldEqual(
    <html>
      <body>
        <p>Hello World!</p>
      </body>
    </html>
  )
})

it('renders html with a query string', async () => {
  const html = await render.html(route, { greeting: 'howdy' })
  html.shouldEqual(
    <html>
      <body>
        <p>howdy!</p>
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
