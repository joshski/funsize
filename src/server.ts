import { createServer, IncomingMessage, ServerResponse } from 'http'
import { controller } from './controller.ts'
import router from './router.ts'
import url from 'node:url'
import { Request } from './index.ts'

const server = createServer(async function respond(
  request: IncomingMessage,
  response: ServerResponse
) {
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
    console.log(`${request.method} ${request.url}`)
    controllerResponse.toStream().pipe(response)
  } catch (error) {
    console.log(`${request.method} ${request.url}\n`, error)
    response.end(error.toString())
  }
})

export default server