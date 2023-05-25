import { Rendering, renderHtml, renderJson, renderSvg } from './render.ts'
import { RouteFinder } from './route.ts'
import { Request } from './index.ts'

export async function controller(
  routes: RouteFinder,
  request: Request
) : Promise<Rendering> {
  const { method, path } = request
  const route = routes.find((r) => r.path === path && r.method === method)
  if (!route) {
    throw new Error(`No route matching ${method} ${path}`)
  }
  const routeModule = await import(route.module)
  const formatter = routeModule[route.format]
  const formatRenderer = formatRenderers[route.format]
  const rendering = await formatRenderer(
    routeModule[method.toLowerCase()],
    formatter,
    request,
    { method: route.method, path: route.path }
  )
  return rendering
}

const formatRenderers = {
  html: renderHtml,
  json: renderJson,
  svg: renderSvg
}
