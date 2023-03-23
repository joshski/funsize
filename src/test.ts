import assert from "assert";
import * as ReactDOMServer from "react-dom/server";

export async function render<Data>(
  load: Loader<Data>,
  render: Renderer<Data>
): Promise<Rendering> {
  const loadResult = await load();
  const renderResult = render(loadResult);
  return new Rendering(renderResult);
}

export function it(title: string, fn: Test) {
  console.log(title);
  fn()
    .then(() => {
      console.log("PASS: " + title);
    })
    .catch((error) => {
      console.error("ERROR: %s\n%o", title, error);
    });
}

type Test = {
  (): Promise<any>;
};

type Loader<Data> = {
  (): Promise<Data>;
};

type Renderer<Data> = {
  (data: Data): string | JSX.Element | object;
};

class Rendering {
  private readonly renderResult: any;

  constructor(renderResult: any) {
    this.renderResult = renderResult;
  }

  get html(): HtmlRendering {
    return new HtmlRendering(this.renderResult as JSX.Element);
  }

  get json(): JsonRendering {
    return new JsonRendering(this.renderResult);
  }
}

class HtmlRendering {
  private readonly renderedElement: JSX.Element;

  constructor(renderedElement: JSX.Element) {
    this.renderedElement = renderedElement;
  }

  toString() {
    return ReactDOMServer.renderToString(this.renderedElement);
  }

  shouldEqual(expectedElement: JSX.Element) {
    const renderedHTML = this.toString();
    const expectedHTML = ReactDOMServer.renderToString(expectedElement);
    assert.deepEqual(renderedHTML, expectedHTML);
  }
}

class JsonRendering {
  private readonly renderedObject: object;

  constructor(renderedObject: object) {
    this.renderedObject = renderedObject;
  }

  shouldEqual(expectedObject: object) {
    assert.deepEqual(this.renderedObject, expectedObject);
  }

  toString() {
    return JSON.stringify(this.renderedObject);
  }
}
