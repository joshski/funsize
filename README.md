# funsize

How a request is rendered on the server-side and then rehydrated on the client-sde:

* Browser requests `GET /foos/123?message=hello (accept: text/html)`
* Server finds handler module at `/routes/foos/[id].tsx`
* Server dynamically imports module
* Module includes `export async function get(request: Request): Response`
* Server instantiates `new Request({ id: 123, message: 'hello' })`
* Server executes `async function get(request: Request)` which returns `Response`
* Module includes `export async function html(response: Response): JSX.Element`
* Server executes `export async function html(response: Response)` which returns `JSX.Element`
* Server injects `<script src="/__hydrate.js" />` into `JSX.Element`
* Server injects `<script>__hydrate({ id: 123, message: 'hello' })</script>` into `JSX.Element`
* Server executes `ReactDOMServer.renderToPipeableStream()` with injected `JSX.Element`
* Server responds to `GET /foos/123?message=hello (accept: text/html)` with stream
* Browser renders HTML
* Browser requests `/__hydrate.js`
* Server renders `html` functions from all routes (tree-shaken) using `esbuild`
* Server responds to `/__hydrate.js`
* Browser executes `__hydrate('/foos/[id].tsx', { id: 123, message: 'hello' })`
* `__hydrate(path, data)` finds `html` function in registry, keyed on `/foos/[id].tsx`
* `__hydrate(path, data)` executes `html({ id: 123, message: 'hello' })` which returns `JSX.Element`
* `__hydrate(path, data)` calls `ReactDOMClient.hydrateRoot(document, jsxElement)`
