import assert from 'node:assert'
import { controller } from './controller.ts'
import { it } from './test.ts'

it('executes HTML handlers', async () => {
  const routes = [
    {
      method: 'get',
      path: '/foo',
      module: '../example/routes/index.tsx',
      format: 'html',
    },
  ]
  const request = {
    method: 'get',
    path: '/foo',
    query: {
      get: <T>(name: string): T => {
        return null as T
      }
    }
  }
  const result = await controller(routes, request)
  const string = result.toString()
  assert.strictEqual(
    string,
    '<html><body><p>Hello World!</p></body></html>'
  )
})

it('executes JSON handlers', async () => {
  const routes = [
    {
      method: 'get',
      path: '/foo',
      module: '../example/routes/index.tsx',
      format: 'json',
    },
  ]
  const request = {
    method: 'get',
    path: '/foo',
    query: {
      get: <T>(name: string): T => {
        return null as T
      }
    }
  }
  const result = await controller(routes, request)
  const string = result.toString()
  assert.strictEqual(string, '{\n  "message": "Hello World!"\n}')
})

it('throws when no route exists', async () => {
  const routes = []
  const request = {
    method: 'get',
    path: '/foo',
    query: {
      get: <T>(name: string): T => {
        return null as T
      }
    }
  }
  await assert.rejects(controller(routes, request), {
    message: 'No route matching get /foo',
  })
})
