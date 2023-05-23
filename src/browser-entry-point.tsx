import { html } from '../example/routes/index.tsx'
import { hydrateRoot } from 'react-dom/client'

window.addEventListener('DOMContentLoaded', function () {
  // TODO: render specific route with specific data
  hydrateRoot(
    document,
    html({ message: 'Hello World' })
  )
})
