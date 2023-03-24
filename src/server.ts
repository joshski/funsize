import { createServer, IncomingMessage, ServerResponse } from 'http'
import { controller } from './controller.ts'
import router from './router.ts'

const server = createServer(async function respond(
  request: IncomingMessage,
  response: ServerResponse
) {
  try {
    const routes = await router()
    const controllerResponse = await controller(
      routes,
      request.method as string,
      request.url as string
    )
    console.log(`${request.method} ${request.url}`)
    response.end(controllerResponse)
  } catch (error) {
    console.log(`${request.method} ${request.url}\n`, error)
    response.end(error.toString())
  }
})

const port = 3000

server.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`)
})
