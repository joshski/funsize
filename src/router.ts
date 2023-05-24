import fastGlob from 'fast-glob'

export default async function router(appDirectory: string) {
  const routesDirectory = `${appDirectory}/routes`
  const tsxFiles = await fastGlob(`${routesDirectory}/**/*.tsx`)
  return (
    await Promise.all(
      tsxFiles.map(async (tsxFile) => {
        const mod = await import(tsxFile)
        return [
          ...(mod.html
            ? [
                {
                  method: 'GET',
                  path: tsxFile
                    .substring(routesDirectory.length)
                    .replace(/^\/index\.tsx$/, '/')
                    .replace(/\.tsx$/, ''),
                  module: tsxFile,
                  format: 'html',
                },
              ]
            : []),
          ...(mod.json
            ? [
                {
                  method: 'GET',
                  path: '/index.json',
                  module: tsxFile,
                  format: 'json',
                },
              ]
            : []),
          ...(mod.svg
            ? [
                {
                  method: 'GET',
                  path: '/favicon.svg',
                  module: tsxFile,
                  format: 'svg',
                },
              ]
            : []),
        ]
      })
    )
  ).flat()
}
