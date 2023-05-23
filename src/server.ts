import { createServer, IncomingMessage, ServerResponse } from 'http'
import { controller } from './controller.ts'
import router from './router.ts'
import url from 'node:url'
import { Request } from './index.ts'
import fs from 'node:fs'
import * as esbuild from 'esbuild'

type ServerOptions = {
  log: (...args) => void
}

const defaultOptions : ServerOptions = {
  log: console.log
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
      const routes = await router()
      const u = url.parse(request.url)
      const internalRequest : Request = {
        path: u.pathname,
        method: request.method,
        query: {
          get<T>(name: string): T {
            return null as T
          }
        }
      }
      const controllerResponse = await controller(
        routes,
        internalRequest
      )
      // console.log(JSON.stringify(controllerResponse, null, 2))
      log(`${request.method} ${request.url}`)
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