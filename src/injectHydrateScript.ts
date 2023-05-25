import { createElement } from 'react'

export default function injectHydrateScript(htmlNode, data = undefined, route = undefined) {
  if (htmlNode?.type !== 'html') {
    return htmlNode
  }
  if (
    typeof htmlNode.props.children === 'object' &&
    Array.isArray(htmlNode.props.children)
  ) {
    const existingHeadNode = htmlNode.props.children.find(
      (node) => node.type === 'head'
    )
    if (existingHeadNode) {
      return createElement(
        'html',
        {},
        ...htmlNode.props.children.map((child) => {
          if (child.type === 'head') {
            return createElement(
              'head',
              {},
              existingHeadNode.props.children,
              createElement('script', { src: '/__hydrate.js' }),
              ...(data
                ? [
                    createElement('script', {
                      dangerouslySetInnerHTML: {
                        __html: `__hydrate(${JSON.stringify({ route, data })})`,
                      },
                    }),
                  ]
                : [])
            )
          }
          return child
        })
      )
    }
  } else if (
    typeof htmlNode.props.children === 'object' &&
    htmlNode.props.children.type === 'body'
  ) {
    return createElement(
      'html',
      {},
      createElement(
        'head',
        {},
        createElement('script', { src: '/__hydrate.js' }),
        ...(data
          ? [
              createElement('script', {
                dangerouslySetInnerHTML: {
                  __html: `__hydrate(${JSON.stringify({ route, data })})`,
                },
              }),
            ]
          : [])
      ),
      htmlNode.props.children
    )
  } else {
    throw new Error('oops: ' + JSON.stringify(htmlNode, null, 2))
  }
}
