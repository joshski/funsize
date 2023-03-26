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
  const result = await controller(routes, 'get', '/foo')
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
  const result = await controller(routes, 'get', '/foo')
  const string = result.toString()
  assert.strictEqual(string, '{\n  "message": "Hello World!"\n}')
})

it('throws when no route exists', async () => {
  const routes = []
  await assert.rejects(controller(routes, 'get', '/foo'), {
    message: 'No route matching get /foo',
  })
})
