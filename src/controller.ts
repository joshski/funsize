import { renderHtml, renderJson } from './test.ts'
import { RouteFinder } from './route.ts'

export async function controller(
  routes: RouteFinder,
  method: string,
  path: string
) {
  const route = routes.find((r) => r.path === path && r.method === method)
  if (!route) {
    throw new Error(`No route matching ${method} ${path}`)
  }
  const routeModule = await import(route.module)
  const formatter = routeModule[route.format]
  if (route.format === 'html') {
    const rendering = await renderHtml(
      routeModule[method.toLowerCase()],
      formatter
    )
    return rendering.toString()
  } else if (route.format === 'json') {
    const rendering = await renderJson(
      routeModule[method.toLowerCase()],
      formatter
    )
    return rendering.toString()
  }
  throw new Error('oops')
}
