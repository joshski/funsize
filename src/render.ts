import * as ReactDOMServer from 'react-dom/server'
import { Readable } from 'stream'
import { Request } from '.'
import injectHydrateScript from './hydration/injectHydrateScript.ts'
import Route from './route.ts'

export async function renderHtml<Data>(
  loader: Loader<Data>,
  renderer: HtmlRenderer<Data>,
  request: Request,
  route: Route
): Promise<HtmlRendering> {
  return renderAny(
    loader,
    renderer,
    request,
    (r, data) => new HtmlRendering(r, data, route)
  )
}

export async function renderJson<Data>(
  loader: Loader<Data>,
  renderer: JsonRenderer<Data>,
  request: Request
): Promise<JsonRendering> {
  return renderAny(loader, renderer, request, (r) => new JsonRendering(r))
}

export async function renderSvg(
  _loader: void,
  renderer: SvgRenderer,
  _request: void,
  route: Route
): Promise<HtmlRendering> {
  return renderAnyWithoutData(renderer, (r) => new HtmlRendering(r, null, route))
}

export async function renderAny<Data, Rendered, Rendering>(
  loader: Loader<Data>,
  renderer: Render<Data, Rendered>,
  request: Request,
  builder: Builder<Rendered, Rendering>
): Promise<Rendering> {
  const data = await loader(request.query)
  return builder(renderer(data), data)
}

export async function renderAnyWithoutData<Rendered, Rendering>(
  renderer: RenderWithoutData<Rendered>,
  builder: Builder<Rendered, Rendering>
): Promise<Rendering> {
  return builder(renderer())
}

export const tests = []

type Builder<Rendered, Rendering> = {
  (rendered: Rendered, data?: any): Rendering
}

export type Loader<Data> = {
  (request?: any): Promise<Data>
}

type HtmlRenderer<Data> = {
  (data: Data): JSX.Element
}

type SvgRenderer = {
  (): JSX.Element
}

export type JsonRenderer<Data> = {
  (data: Data): object
}

export type Render<Data, Rendered> = {
  (data: Data): Rendered
}

export type RenderWithoutData<Rendered> = {
  (): Rendered
}

export interface Rendering {
  toString(): string
  toStream(): PipeableStream
  getContentType(): string
}

export interface PipeableStream {
  pipe<Writable extends NodeJS.WritableStream>(destination: Writable): Writable
}

export class HtmlRendering implements Rendering {
  private readonly renderedElement: JSX.Element
  private readonly data: any
  private readonly route: Route

  constructor(renderedElement: JSX.Element, data: any, route: Route) {
    this.renderedElement = renderedElement
    this.data = data
    this.route = route
  }

  toString() {
    return ReactDOMServer.renderToString(this.renderedElement)
  }

  toStream() {
    return ReactDOMServer.renderToPipeableStream(
      injectHydrateScript(this.renderedElement, this.data, this.route)
    )
  }

  getContentType(): string {
    if (this.renderedElement.type === 'svg') {
      return 'image/svg+xml'
    }
    return 'text/html'
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

  getContentType(): string {
    return 'application/json'
  }
}
