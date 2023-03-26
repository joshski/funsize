import assert from 'assert'
import * as ReactDOMServer from 'react-dom/server'
import { Readable } from 'stream'

export async function renderHtml<Data>(
  load: Loader<Data>,
  render: HtmlRenderer<Data>
): Promise<HtmlRendering> {
  const loadResult = await load()
  const renderResult = render(loadResult)
  return new HtmlRendering(renderResult)
}

export async function renderJson<Data>(
  load: Loader<Data>,
  render: JsonRenderer<Data>
): Promise<JsonRendering> {
  const loadResult = await load()
  const renderResult = render(loadResult)
  return new JsonRendering(renderResult)
}

export const tests = []

export function it(title: string, fn: Test) {
  tests.push({ title, fn })
}

type Test = {
  (): Promise<void>
}

type Loader<Data> = {
  (): Promise<Data>
}

type HtmlRenderer<Data> = {
  (data: Data): JSX.Element
}

type JsonRenderer<Data> = {
  (data: Data): object
}

class HtmlRendering {
  private readonly renderedElement: JSX.Element

  constructor(renderedElement: JSX.Element) {
    this.renderedElement = renderedElement
  }

  toString() {
    return ReactDOMServer.renderToString(this.renderedElement)
  }

  toStream() {
    return ReactDOMServer.renderToPipeableStream(this.renderedElement)
  }

  shouldEqual(expectedElement: JSX.Element) {
    const renderedHTML = this.toString()
    const expectedHTML = ReactDOMServer.renderToString(expectedElement)
    assert.deepEqual(renderedHTML, expectedHTML)
  }
}

class JsonRendering {
  private readonly renderedObject: object

  constructor(renderedObject: object) {
    this.renderedObject = renderedObject
  }

  shouldEqual(expectedObject: object) {
    assert.deepEqual(this.renderedObject, expectedObject)
  }

  toString() {
    return JSON.stringify(this.renderedObject)
  }

  toStream() {
    const s = new Readable()
    s.push(this.toString())
    s.push(null)
    return s
  }
}
