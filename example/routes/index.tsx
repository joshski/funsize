export async function get() {
  return { message: 'Hello World' }
}

export function html(data: Data) {
  return (<html><body><p>{data.message + '!'}</p></body></html>)
}

export function json(data: Data) {
  return { message: `${data.message}!` }
}

interface Data {
  message: string;
}
