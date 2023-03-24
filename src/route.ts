export interface RouteFinder {
  find(predicate: RoutePredicate): Route
}

type RoutePredicate = {
  (route: Route): boolean
}

export default interface Route {
  path: string
  method: string
  module: string
  format: string
}
