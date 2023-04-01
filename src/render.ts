import * as ReactDOMServer from 'react-dom/server'
import { Readable } from 'stream'
import { Request } from '.'

type Builder<Rendered, Rendering> = {
  (rendered: Rendered): Rendering
}

export async function renderAny<Data, Rendered, Rendering>(
  load: Loader<Data>,
  render: Render<Data, Rendered>,
  request: Request,
  builder: Builder<Rendered, Rendering>
): Promise<Rendering> {
  const loadResult = await load(request)
  const renderResult = render(loadResult)
  const rendering = builder(renderResult)
  return rendering
}

export async function renderHtml<Data>(
  load: Loader<Data>,
  render: HtmlRenderer<Data>,
  request: Request
): Promise<HtmlRendering> {
  return renderAny(load, render, request, (r) => new HtmlRendering(r))
}

export async function renderJson<Data>(
  load: Loader<Data>,
  render: JsonRenderer<Data>,
  request: Request
): Promise<JsonRendering> {
  return renderAny(load, render, request, (r) => new JsonRendering(r))
}

export const tests = []

export type Loader<Data> = {
  (request?: Request): Promise<Data>
}

type HtmlRenderer<Data> = {
  (data: Data): JSX.Element
}

export type JsonRenderer<Data> = {
  (data: Data): object
}

export type Render<Data, Rendered> = {
  (data: Data): Rendered
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
