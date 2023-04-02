import assert from 'node:assert'
import { it, render } from './test.ts'

it('renders HTML', async function () {
  const load = async () => ({ lives: 9 })
  const renderer = (data: Data) => (<p>{data.lives}</p>)
  const rendering = await render.html<Data>(load, renderer, {})
  assert.strictEqual(rendering.toString(), '<p>9</p>')
})

interface Data {
  lives: number
}
