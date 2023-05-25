import { html as rootIndexHtml } from '../example/routes/index.tsx'
import { html as aboutUsHtml } from '../example/routes/about/us.tsx'
import { hydrateRoot } from 'react-dom/client'
import injectHydrateScript from './hydration/injectHydrateScript.ts'

const routeMap = {
  '/': rootIndexHtml,
  '/about/us': aboutUsHtml
}

window.__hydrate = function({ route, data }) {
  const html = routeMap[route.path]
  window.addEventListener('DOMContentLoaded', function () {
    hydrateRoot(
      document,
      injectHydrateScript(
        html(data)
      )
    )
  })
}