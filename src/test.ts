import assert from 'assert'
import * as ReactDOMServer from 'react-dom/server'
import { HtmlRendering, JsonRendering, renderAny } from './render.ts'
import { Request } from './index.ts'

export const render = {
  async html<Data>(route: HtmlRoute<Data>, request: Request | object = {}) {
    return renderAny<Data, JSX.Element, TestHtmlRendering>(
      route.get,
      route.html,
      buildRequest(request),
      (r) => new TestHtmlRendering(r)
    )
  },

  async json<Data>(route: JsonRoute<Data>, request: Request | object = {}) {
    return renderAny<Data, object, TestJsonRendering>(
      route.get,
      route.json,
      buildRequest(request),
      (r) => new TestJsonRendering(r)
    )
  },
}

function buildRequest(object: Request | object): Request {
  if ('query' in object) {
    return object as Request
  }
  return {
    method: null,
    path: '',
    query: {
      get(name: string): string {
        return object[name]
      },
    },
  }
}

export const tests = []

export function it(title: string, fn: Test) {
  tests.push({ title, fn })
}

type Test = {
  (): Promise<void>
}

interface HtmlRoute<Data> {
  get(request: Request): Promise<Data>
  html(data: Data): JSX.Element
}

interface JsonRoute<Data> {
  get(request: Request): Promise<Data>
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
