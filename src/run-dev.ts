import server from './server.ts'
import open from 'open'
import execa from 'execa'
import { emitKeypressEvents } from 'node:readline';

const port = 3000

server().listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`)
  dev()
})

async function dev() {
  emitKeypressEvents(process.stdin)
  process.stdin.setRawMode(true);
  process.stdin.on('keypress', keypress)
  console.clear()
  logOptions()
}

function logOptions() {
  console.log('\n\x1b[32mt\x1b[0m tests \x1b[90m|\x1b[0m \x1b[32mc\x1b[0m coverage \x1b[90m|\x1b[0m \x1b[32mb\x1b[0m browser\n')
}

const commands = {
  t: tests,
  c: coverage,
  b: browser
}

async function keypress(s, key) {
  if (key.name === 'c' && key.ctrl) {
    process.exit();
  } else if (commands[key.name]) {
    await commands[key.name]()
    logOptions()
  }
}

async function tests() {
  console.clear()
  await execa('./bin/test.sh', [], { shell: true, stdio: 'inherit' })
}

async function coverage() {
  console.clear()
  await execa('./bin/coverage.sh', [], { shell: true, stdio: 'inherit' })
}

function browser() {
  open('http://localhost:3000')
}
