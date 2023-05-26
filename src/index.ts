export type Request = {
  method: string,
  path: string,
  query: Dictionary<string>
}

interface Dictionary<T> {
  [Key: string]: T;
}
