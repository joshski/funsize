export type Request = {
  method: string,
  path: string,
  query: QueryString
}

export type QueryString = {
  get<T>(name: string) : T
}