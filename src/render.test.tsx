import assert from 'node:assert'
import { it, render } from './test.ts'

it('renders a route as HTML', async function () {
  const route = {
    async get() {
      return { lives: 9 }
    },

    html(data: Data) {
      return (<p>{data.lives}</p>)
    }
  }
  const rendering = await render.html<Data>(route, {})
  assert.strictEqual(rendering.toString(), '<p>9</p>')
})

interface Data {
  lives: number
}
