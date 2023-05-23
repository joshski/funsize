import assert from 'node:assert'
import server from './server.ts'
import supertest from 'supertest'
import { it } from './test.ts'

const serverOptions = { log: () => {} }

it('responds to HTTP requests', async () => {
  const response = await supertest(server(serverOptions)).get('/')
  assert.strictEqual(
    response.text,
    '<!DOCTYPE html><html><head><script src="/__hydrate.js"></script></head><body><p>Hello World!</p><button>You clicked me <!-- -->0<!-- --> times</button></body></html>'
  )
})

it('responds with JSON', async () => {
  const response = await supertest(server(serverOptions)).get('/index.json')
  assert.strictEqual(
    response.text,
    '{\n  "message": "Hello World!"\n}'
  )
})
