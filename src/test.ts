import assert from 'assert'
import * as ReactDOMServer from 'react-dom/server'
import {
  HtmlRendering,
  JsonRendering,
  renderAny,
  Loader,
  Render,
  JsonRenderer,
} from './render.ts'
import { Request } from './index.ts'

export const render = {
  async html<Data>(
    load: Loader<Data>,
    render: Render<Data, JSX.Element>,
    request: Request | object = {}
  ) {
    return renderAny<Data, JSX.Element, TestHtmlRendering>(
      load,
      render,
      buildRequest(request),
      (r) => new TestHtmlRendering(r)
    )
  },

  async json<Data>(
    load: Loader<Data>,
    render: JsonRenderer<Data>,
    request: Request | object = {}
  ) {
    return renderAny<Data, object, TestJsonRendering>(
      load,
      render,
      buildRequest(request),
      (r) => new TestJsonRendering(r)
    )
  }
}

function buildRequest(object: Request | object): Request {
  if ('query' in object) {
    return object as Request
  }
  return {
    query: {
      get<T>(name: string) {
        return object[name] as T
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
