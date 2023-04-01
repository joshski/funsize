export type Request = {
  query: QueryString
}

export type QueryString = {
  get<T>(name: string) : T
}