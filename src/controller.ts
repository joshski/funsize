import { Rendering, renderHtml, renderJson } from './render.ts'
import { RouteFinder } from './route.ts'
import router from './router.ts'

export async function controller(
  routes: RouteFinder,
  method: string,
  path: string
) : Promise<Rendering> {
  const route = routes.find((r) => r.path === path && r.method === method)
  if (!route) {
    throw new Error(`No route matching ${method} ${path}`)
  }
  const routeModule = await import(route.module)
  const formatter = routeModule[route.format]
  const formatRenderer = formatRenderers[route.format]
  const rendering = await formatRenderer(
    routeModule[method.toLowerCase()],
    formatter
  )
  return rendering
}

const formatRenderers = {
  html: renderHtml,
  json: renderJson
}
