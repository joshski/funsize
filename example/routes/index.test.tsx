import { get, html, json } from './index.tsx'
import { it, renderHtml, renderJson } from '../../src/test.ts'

it('renders html', async () => {
  const rendered = await renderHtml(get, html)
  rendered.shouldEqual(
    <html>
      <body>
        <p>Hello World!</p>
      </body>
    </html>
  )
})

it('renders html with a query string', async () => {
  const rendered = await renderHtml(get, html, { greeting: 'howdy' })
  rendered.shouldEqual(
    <html>
      <body>
        <p>howdy!</p>
      </body>
    </html>
  )
})

it('renders json', async () => {
  const rendered = await renderJson(get, json)
  rendered.shouldEqual({ message: 'Hello World!' })
})
