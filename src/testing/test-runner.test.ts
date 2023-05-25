import assert from 'node:assert'
import { runTests } from './test-runner.ts'
import { it } from './test.ts'
import os from 'node:os'
import { mkdirSync } from 'node:fs'
import { randomUUID } from 'node:crypto'
import path from 'node:path'
import { writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'url'
const __dirname = path.resolve(fileURLToPath(import.meta.url), '..')

it('fails tests', async () => {
  const testsHelperPath = path.join(__dirname, 'test.ts')
  const dir = path.join(os.tmpdir(), randomUUID())
  mkdirSync(dir)
  const js = [
    `import { it } from '${testsHelperPath}'`,
    '',
    "it('fails', async () => { throw new Error('nope') })",
  ]
  const jsPath = path.join(dir, 'some-test.ts')
  await writeFile(jsPath, js.join('\n'))

  const paths = ['**/*.yeah.ts']
  const glob = async () => ['./some-test.ts']
  const outputs = []
  const writeOutput = (type, args) => outputs.push({
    type,
    args: args.map((a) => (a instanceof Error ? a.message : a)),
  })
  const console = {
    log(...args) {
      writeOutput('console.log', args)
    },
    error(...args) {
      writeOutput('console.error', args)
    },
  }
  const stdout = {
    write(...args) {
      writeOutput('stdout.write', args)
    },
  }

  await runTests({ paths, cwd: dir, stdout, console, glob })
  const expected = [
    { type: 'stdout.write', args: ['!'] },
    { type: 'console.log', args: ['\nError executing fails'] },
    {
      type: 'console.error',
      args: ['nope'],
    },
    { type: 'console.log', args: [''] },
    {
      type: 'console.log',
      args: ['\u001b[32m%s\u001b[0m tests passed', 0],
    },
    {
      type: 'console.log',
      args: ['\u001b[32m%s\u001b[0m tests failed', 1],
    },
  ]
  assert.deepStrictEqual(outputs, expected)
})
