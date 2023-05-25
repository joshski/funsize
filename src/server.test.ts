import assert from 'node:assert'
import server from './server.ts'
import supertest from 'supertest'
import { it } from './test.ts'
import path from 'node:path'
import { fileURLToPath } from 'url'
const __dirname = path.resolve(fileURLToPath(import.meta.url), '..')
const appDirectory = path.resolve(__dirname, '..', 'example')

const serverOptions = { log: () => {}, appDirectory }

it('responds to HTTP requests', async () => {
  const response = await supertest(server(serverOptions)).get('/')
  assert.strictEqual(response.headers['content-type'], 'text/html')
  assert.strictEqual(
    response.text,
    '<!DOCTYPE html><html><head><link rel="icon" href="/favicon.svg"/><script src="/__hydrate.js"></script>' +
    '<script>__hydrate({"route":{"method":"GET","path":"/"},"data":{"message":"Hello World"}})</script>' + 
    '</head><body><p>Hello World!</p><button>You clicked me <!-- -->0<!-- --> times</button></body></html>'
  )
})

it('responds with JSON', async () => {
  const response = await supertest(server(serverOptions)).get('/index.json')
  assert.strictEqual(response.headers['content-type'], 'application/json')
  assert.strictEqual(response.text, '{\n  "message": "Hello World!"\n}')
})

it('responds with SVG', async () => {
  const response = await supertest(server(serverOptions)).get('/favicon.svg')
  assert.strictEqual(response.headers['content-type'], 'image/svg+xml')
  assert.match(
    response.body.toString(),
    new RegExp('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36">')
  )
})
