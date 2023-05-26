import assert from 'assert'
import * as ReactDOMServer from 'react-dom/server'
import { HtmlRendering, JsonRendering, renderAny, renderAnyWithoutData } from '../render.ts'
import { Request } from '../index.ts'

export const render = {
  async html<Params, Data>(route: HtmlRoute<Params, Data>, request: object = {}) {
    return renderAny<Data, JSX.Element, TestHtmlRendering>(
      route.get,
      route.html,
      buildRequest(request),
      (r) => new TestHtmlRendering(r)
    )
  },

  async json<Params, Data>(route: JsonRoute<Params, Data>, request: object = {}) {
    return renderAny<Data, object, TestJsonRendering>(
      route.get,
      route.json,
      buildRequest(request),
      (r) => new TestJsonRendering(r)
    )
  },

  async svg(route: SvgRoute) {
    return renderAnyWithoutData<JSX.Element, TestHtmlRendering>(
      route.svg,
      (r) => new TestHtmlRendering(r)
    )
  },
}

function buildRequest(query: any): Request {
  return {
    method: null,
    path: '',
    query
  }
}

export const tests = []

export function it(title: string, fn: Test) {
  tests.push({ title, fn })
}

type Test = {
  (): Promise<void>
}

interface HtmlRoute<Params, Data> {
  get(params: Params): Promise<Data>
  html(data: Data): JSX.Element
}

interface SvgRoute {
  svg(): JSX.Element
}

interface JsonRoute<Params, Data> {
  get(params: Params): Promise<Data>
  json(data: Data): object
}

class TestHtmlRendering extends HtmlRendering {
  shouldEqual(expectedElement: JSX.Element | string) {
    const renderedHTML = this.toString()
    const expectedHTML =
      typeof expectedElement === 'string'
        ? expectedElement
        : ReactDOMServer.renderToString(expectedElement)
    assert.equal(renderedHTML, expectedHTML)
  }
}

class TestJsonRendering extends JsonRendering {
  shouldEqual(expectedObject: object) {
    assert.deepEqual(this.renderedObject, expectedObject)
  }
}
