import React from "react";
import { get, html, json } from "./index.tsx";
import { it, render } from "../../src/test.ts";

it('renders html', async () => {
  const response = await render(get, html)
  response.html.shouldEqual(<p>Hello World!</p>)
})

it('renders json', async () => {
  const response = await render(get, json)
  response.json.shouldEqual({ message: 'Hello World!' })
})
