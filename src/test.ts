import assert from 'assert'
import * as ReactDOMServer from 'react-dom/server'
import { HtmlRendering, JsonRendering, renderAny, Loader, Render, JsonRenderer } from './render.ts'
import { Request } from './index.ts'

const nullRequest: Request = {
  query: {
    get<T>(_name: string): T {
      return null as T
    },
  }
}

export async function renderHtml<Data>(
  load: Loader<Data>,
  render: Render<Data, JSX.Element>,
  request: Request | object = nullRequest
): Promise<TestHtmlRendering> {
  return renderAny<Data, JSX.Element, TestHtmlRendering>(
    load,
    render,
    buildRequest(request),
    (r) => new TestHtmlRendering(r)
  )
}

function buildRequest(object: Request | object) : Request {
  if ('query' in object) {
    return object as Request
  }
  return {
    query: {
      get<T>(name: string) {
        return object[name] as T
      }
    }
  }
}

export async function renderJson<Data>(
  load: Loader<Data>,
  render: JsonRenderer<Data>,
  request: Request = nullRequest
): Promise<TestJsonRendering> {
  return renderAny(load, render, request, (r) => new TestJsonRendering(r))
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
