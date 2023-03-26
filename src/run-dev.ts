import server from './server.ts'
import Enquirer from 'enquirer'
import open from 'open'
import execa from 'execa'
const AutoComplete = (Enquirer as any).AutoComplete

const port = 3000

server.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`)
  dev()
})

async function dev() {
  const commands = new Commands()

  const prompt = new AutoComplete({
    limit: 10,
    initial: 0,
    choices: methodsOf(Commands),
  })

  let answer
  try {
    answer = await prompt.run()
  } catch (e) {
    process.exit(1)
  }
  const result = commands[answer].call(commands)
  if (typeof result === 'object' && typeof result.then === 'function') {
    await result
  }
  await dev()
}

class Commands {
  async 'Run all tests'() {
    await execa('npm test', [], { shell: true, stdio: 'inherit' })
  }
  'Open Browser'() {
    open('http://localhost:3000')
  }
  'Quit'() {
    process.exit(0)
  }
}

function methodsOf(Class) {
  const array = []
  function methods(obj) {
    if (obj) {
      for (const p of Object.getOwnPropertyNames(obj)) {
        if (obj[p] instanceof Function && p !== 'constructor') {
          array.push(p)
        }
      }
      const p = Object.getPrototypeOf(obj)
      if (p !== Object.prototype) {
        methods(p)
      }
    }
  }
  methods(Class.prototype)
  return array
}

