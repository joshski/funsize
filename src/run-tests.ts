import { tests } from './test.ts'
import glob from 'fast-glob'
import path from 'path'
import { stdout } from 'process'
import { fileURLToPath } from 'url'
import util from 'node:util'
const __dirname = path.resolve(fileURLToPath(import.meta.url), '..')

async function runTests({ cwd = process.cwd() }) {
  let paths = process.argv.slice(2)
  if (paths.length === 0) {
    paths = ['./**/*.test.*']
  }
  const globbedPaths = await glob(paths)
  const resolvedPaths = globbedPaths.map((gp) =>
    path.resolve(cwd, gp)
  )
  const relativePaths = resolvedPaths
    .map((rp) => path.relative(__dirname, rp))
    .map((p) => (p.startsWith('.') ? p : `./${p}`))
  await Promise.all(relativePaths.map((rp) => import(rp)))
  let passes = 0
  let fails = 0
  async function runTest(test) {
    try {
      await test.fn()
      stdout.write(util.format('\x1b[32m%s\x1b[0m', '.'))
      passes++
    } catch (e) {
      stdout.write('!')
      console.log(`\nError executing ${test.title}`)
      console.error(e)
      fails++
    }
  }
  await Promise.all(tests.map(runTest))
  console.log('')
  console.log('\x1b[32m%s\x1b[0m tests passed', passes)
  console.log('\x1b[32m%s\x1b[0m tests failed', fails)
}

runTests({})
