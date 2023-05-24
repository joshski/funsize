import { html } from '../example/routes/index.tsx'
import { hydrateRoot } from 'react-dom/client'
import injectHydrateScript from './injectHydrateScript.ts'

window.addEventListener('DOMContentLoaded', function () {
  // TODO: render specific route with specific data
  hydrateRoot(
    document,
    injectHydrateScript(html({ message: 'Hello World' }))
  )
})
