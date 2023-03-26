import { tests } from './test.ts'
import glob from 'fast-glob'
import path from 'path'
import { stdout } from 'process'
import { fileURLToPath } from 'url'
const __dirname = path.resolve(fileURLToPath(import.meta.url), '..')

async function runTests() {
  const paths = process.argv.slice(2)
  const globbedPaths = await glob(paths)
  const resolvedPaths = globbedPaths.map((gp) =>
    path.resolve(process.cwd(), gp)
  )
  const relativePaths = resolvedPaths
    .map((rp) => path.relative(__dirname, rp))
    .map((p) => (p.startsWith('.') ? p : `./${p}`))
  await Promise.all(relativePaths.map((rp) => import(rp)))
  let passes = 0
  let fails = 0
  for (const test of tests) {
    try {
      await test.fn()
      stdout.write('.')
      passes++
    } catch (e) {
      stdout.write('!')
      console.error(e)
      fails++
    }
  }
  console.log('')
  console.log(`${passes} tests passed`)
  console.log(`${fails} tests failed`)
}

runTests()
