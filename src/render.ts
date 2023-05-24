import * as ReactDOMServer from 'react-dom/server'
import { Readable } from 'stream'
import { Request } from '.'
import injectHydrateScript from './injectHydrateScript.ts'

export async function renderHtml<Data>(
  loader: Loader<Data>,
  renderer: HtmlRenderer<Data>,
  request: Request
): Promise<HtmlRendering> {
  return renderAny(loader, renderer, request, (r) => new HtmlRendering(r))
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
  _request: void
): Promise<HtmlRendering> {
  return renderAnyWithoutData(renderer, (r) => new HtmlRendering(r))
}

export async function renderAny<Data, Rendered, Rendering>(
  loader: Loader<Data>,
  renderer: Render<Data, Rendered>,
  request: Request,
  builder: Builder<Rendered, Rendering>
): Promise<Rendering> {
  return builder(renderer(await loader(request)))
}

export async function renderAnyWithoutData<Rendered, Rendering>(
  renderer: RenderWithoutData<Rendered>,
  builder: Builder<Rendered, Rendering>
): Promise<Rendering> {
  return builder(renderer())
}

export const tests = []

type Builder<Rendered, Rendering> = {
  (rendered: Rendered): Rendering
}

export type Loader<Data> = {
  (request?: Request): Promise<Data>
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

  constructor(renderedElement: JSX.Element) {
    this.renderedElement = renderedElement
  }

  toString() {
    return ReactDOMServer.renderToString(this.renderedElement)
  }

  toStream() {
    return ReactDOMServer.renderToPipeableStream(injectHydrateScript(this.renderedElement))
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
