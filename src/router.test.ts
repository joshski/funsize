import assert from 'node:assert'
import { it } from './test.ts'
import path from 'node:path'
import { fileURLToPath } from 'url'
import router from './router.ts'
const __dirname = path.resolve(fileURLToPath(import.meta.url), '..')
const appDirectory = path.resolve(__dirname, '..', 'example')

it('finds routes', async () => {
  const routes = await router(appDirectory)
  assert.deepStrictEqual(routes, [
    {
      method: 'GET',
      path: '/favicon.svg',
      module: `${appDirectory}/routes/favicon.svg.tsx`,
      format: 'svg',
    },
    {
      method: 'GET',
      path: '/',
      module: `${appDirectory}/routes/index.tsx`,
      format: 'html',
    },
    {
      method: 'GET',
      path: '/index.json',
      module: `${appDirectory}/routes/index.tsx`,
      format: 'json',
    },
    {
      method: 'GET',
      path: '/about/us.svg',
      module: `${appDirectory}/routes/about/us.svg.tsx`,
      format: 'svg',
    },
    {
      method: 'GET',
      path: '/about/us',
      module: `${appDirectory}/routes/about/us.tsx`,
      format: 'html',
    },
  ])
})
