import { runTests } from '../testing/test-runner.ts'
import fastGlob from 'fast-glob'

runTests({
  paths: process.argv.slice(2),
  cwd: process.cwd(),
  console: global.console,
  stdout: process.stdout,
  glob: fastGlob
})
