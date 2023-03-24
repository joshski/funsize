// TODO: load these dynamically, based on process.cwd or process.argv

export default async function router() {
  return [
    {
      method: 'GET',
      path: '/',
      module: '../example/routes/index.tsx',
      format: 'html',
    },
    {
      method: 'GET',
      path: '/index.json',
      module: '../example/routes/index.tsx',
      format: 'json',
    },
  ]
}
