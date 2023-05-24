import { createServer, IncomingMessage, ServerResponse } from 'http'
import { controller } from './controller.ts'
import router from './router.ts'
import url from 'node:url'
import { Request } from './index.ts'
import path from 'node:path'
import * as esbuild from 'esbuild'
import querystring from 'node:querystring'

type ServerOptions = {
  log: (...args) => void,
  appDirectory: string
}

const defaultOptions : ServerOptions = {
  log: console.log,
  appDirectory: path.resolve(process.cwd(), process.argv[2] || '.')
}

export default function server(options: ServerOptions = defaultOptions) {
  const { log } = options
  const s = createServer(async function respond(
    request: IncomingMessage,
    response: ServerResponse
  ) {
    if (request.url === '/__hydrate.js') {
      return buildHydrateScript()
        .then(js => {
          response.writeHead(200, { 'Content-Type': 'application/javascript' })
          response.end(js)
        })
        .catch(error => {
          log(`${request.method} ${request.url}\n`, error)
          response.end(error.toString())
        })
    }

    try {
      const routes = await router(options.appDirectory)
      const u = url.parse(request.url)
      const query = querystring.parse(u.query) as any
      const internalRequest : Request = {
        path: u.pathname,
        method: request.method,
        query: {
          get(name: string): string {
            return query[name]
          }
        }
      }
      const controllerResponse = await controller(
        routes,
        internalRequest
      )
      log(`${request.method} ${request.url}`)
      response.writeHead(200, { 'Content-Type': controllerResponse.getContentType() })
      controllerResponse.toStream().pipe(response)
    } catch (error) {
      log(`${request.method} ${request.url}\n`, error)
      response.end(error.toString())
    }
  })
  
  return s
}

async function buildHydrateScript() {
  const result = await esbuild.build({
    entryPoints: ['./src/browser-entry-point.jsx'],
    bundle: true,
    // sourcemap: 'external',
    write: false,
    outdir: 'out'
  })
  return result.outputFiles[0].text
}