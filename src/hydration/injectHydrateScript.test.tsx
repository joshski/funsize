import assert from 'node:assert'
import { it } from '../testing/test.ts'
import injectHydrateScript from './injectHydrateScript.ts'
import * as ReactDOMServer from 'react-dom/server'

it('injects a script into the <head> (when there is no <head> already)', async () => {
  const html = (
    <html>
      <body>
        <p>Hello World!</p>
      </body>
    </html>
  )
  const injected = injectHydrateScript(html)
  const renderedHtml = ReactDOMServer.renderToString(injected)
  assert.equal(
    renderedHtml,
    '<html><head><script src="/__hydrate.js"></script></head><body><p>Hello World!</p></body></html>'
  )
})

it('injects a script into the <head> (when there is a <head> with children already)', async () => {
  const html = (
    <html>
      <head>
        <title>Hello!</title>
      </head>
      <body>
        <p>Hello World!</p>
      </body>
    </html>
  )
  const injected = injectHydrateScript(html)
  const renderedHtml = ReactDOMServer.renderToString(injected)
  assert.equal(
    renderedHtml,
    '<html><head><title>Hello!</title><script src="/__hydrate.js"></script></head><body><p>Hello World!</p></body></html>'
  )
})

it('injects a script into the <head> (when there is a <head> with many children already)', async () => {
  const html = (
    <html>
      <head>
        <title>Hello!</title>
        <script src="/good" />
      </head>
      <body>
        <p>Hello World!</p>
      </body>
    </html>
  )
  const injected = injectHydrateScript(html)
  const renderedHtml = ReactDOMServer.renderToString(injected)
  assert.equal(
    renderedHtml,
    '<html><head><title>Hello!</title><script src="/good"></script><script src="/__hydrate.js"></script></head><body><p>Hello World!</p></body></html>'
  )
})