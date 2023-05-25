import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { transform } from '@swc/core'

const extensionsRegex = /\.tsx?$/

export async function load(url, context, nextLoad) {
  if (url.startsWith('node:')) {
    return nextLoad(url, context)
  }

  if (extensionsRegex.test(url)) {
    const rawSource = await readFile(fileURLToPath(url), 'utf-8')

    const { code } = await transform(rawSource, {
      filename: url,
      jsc: {
        target: 'es2018',
        parser: {
          syntax: 'typescript',
          jsx: true,
          dynamicImport: true,
        },
        transform: {
          react: {
            runtime: 'automatic',
          },
        },
      },
      module: {
        type: 'es6',
      },
      sourceMaps: 'inline',
    })

    return {
      format: 'module',
      shortCircuit: true,
      source: code,
    }
  }

  // Assume files without extensions (e.g. tsc) are 'commonjs'
  context.format ||= 'commonjs'

  // Let Node.js handle all other URLs.
  return nextLoad(url, context)
}
