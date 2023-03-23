import { render } from "./test.ts";
import { RouteFinder } from "./route.ts";

export async function controller(routes: RouteFinder, method: string, path: string) {
  const route = routes.find(r => r.path === path && r.method === method)
  if (!route) { throw new Error(`No route matching ${method} ${path}`) }
  const routeModule = await import(route.module);
  const formatter = routeModule[route.format]
  const result = await render(routeModule[method.toLowerCase()], formatter);
  return result[route.format].toString()
}
