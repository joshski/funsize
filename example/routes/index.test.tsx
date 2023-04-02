import { get, html, json } from './index.tsx'
import { it, renderHtml, renderJson } from '../../src/test.ts'

it('renders html', async () => {
  const renderedHtml = await renderHtml(get, html)
  renderedHtml.shouldEqual(
    <html>
      <body>
        <p>Hello World!</p>
      </body>
    </html>
  )
})

it('renders html with a query string', async () => {
  const renderedHtml = await renderHtml(get, html, { greeting: 'howdy' })
  renderedHtml.shouldEqual(
    <html>
      <body>
        <p>howdy!</p>
      </body>
    </html>
  )
})

it('renders json', async () => {
  const renderedJson = await renderJson(get, json)
  renderedJson.shouldEqual({ message: 'Hello World!' })
})
