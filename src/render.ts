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

type Loader<Data> = {
  (): Promise<Data>
}

type HtmlRenderer<Data> = {
  (data: Data): JSX.Element
}

type JsonRenderer<Data> = {
  (data: Data): object
}

export interface Rendering {
  toString(): string
  toStream(): PipeableStream
}

export interface PipeableStream {
  pipe<Writable extends NodeJS.WritableStream>(destination: Writable): Writable
}

export class HtmlRendering implements Rendering {
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
}

export class JsonRendering implements Rendering {
  protected readonly renderedObject: object

  constructor(renderedObject: object) {
    this.renderedObject = renderedObject
  }

  toString() {
    return JSON.stringify(this.renderedObject, null, 2)
  }

  toStream() {
    const s = new Readable()
    s.push(this.toString())
    s.push(null)
    return s
  }
}
