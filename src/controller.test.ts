import assert from 'node:assert'
import { controller } from './controller.ts'
import { it } from './test.ts'

it('executes handlers', async () => {
  const routes = [
    {
      method: 'get',
      path: '/foo',
      module: '../example/routes/index.tsx',
      format: 'html',
    },
  ]
  const result = await controller(routes, 'get', '/foo')
  assert.strictEqual(
    result.toString(),
    '<html><body><p>Hello World!</p></body></html>'
  )
})
