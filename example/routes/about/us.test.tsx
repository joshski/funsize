import { it, render } from '../../../src/test.ts'
import { Counter } from '../../components/Counter.tsx'
import * as route from './us.tsx'

it('renders html', async () => {
  const html = await render.html(route)
  html.shouldEqual(
    <html>
      <head>
        <link rel="icon" href="/favicon.svg"/>
      </head>
      <body>
        <h1>About us</h1>
        <p>About us text...</p>
        <p>
          <Counter />
        </p>
        <p>
          <img src="us.svg"/>
        </p>
      </body>
    </html>
  )
})

it('renders json', async () => {
  const json = await render.json(route)
  json.shouldEqual({
    contents: 'About us text...',
    heading: 'About us',
    hell: 'yes'
  })
})
