import { html as rootIndexHtml } from '../example/routes/index.tsx'
import { html as aboutUsHtml } from '../example/routes/about/us.tsx'
import { hydrateRoot } from 'react-dom/client'
import injectHydrateScript from './injectHydrateScript.ts'

window.addEventListener('DOMContentLoaded', function () {
  // TODO: replace with dynamically generated router
  //       and expect page to eventually trigger an event with route data

  if (window.location.href.endsWith('/about/us')) {
    hydrateRoot(
      document,
      injectHydrateScript(
        aboutUsHtml({ heading: 'About us', contents: 'About us text...' })
      )
    )
  } else {
    hydrateRoot(
      document,
      injectHydrateScript(rootIndexHtml({ message: 'Hello World' }))
    )
  }

})
