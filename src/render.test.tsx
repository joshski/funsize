import assert from 'node:assert'
import { it, renderHtml } from './test.ts'

it('renders HTML', async function () {
  const load = async () => ({ lives: 9 })
  const render = (data: Data) => (<p>{data.lives}</p>)
  const rendering = await renderHtml<Data>(load, render)
  assert.strictEqual(rendering.toString(), '<p>9</p>')
})

interface Data {
  lives: number
}
