import assert from 'assert'
import * as ReactDOMServer from 'react-dom/server'
import { HtmlRendering, JsonRendering } from './render.ts'

export async function renderHtml<Data>(
  load: Loader<Data>,
  render: HtmlRenderer<Data>
): Promise<TestHtmlRendering> {
  const loadResult = await load()
  const renderResult = render(loadResult)
  return new TestHtmlRendering(renderResult)
}

export async function renderJson<Data>(
  load: Loader<Data>,
  render: JsonRenderer<Data>
): Promise<TestJsonRendering> {
  const loadResult = await load()
  const renderResult = render(loadResult)
  return new TestJsonRendering(renderResult)
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

class TestHtmlRendering extends HtmlRendering {
  shouldEqual(expectedElement: JSX.Element) {
    const renderedHTML = this.toString()
    const expectedHTML = ReactDOMServer.renderToString(expectedElement)
    assert.deepEqual(renderedHTML, expectedHTML)
  }
}

class TestJsonRendering extends JsonRendering {
  shouldEqual(expectedObject: object) {
    assert.deepEqual(this.renderedObject, expectedObject)
  }
}
