// @refresh reload
import { HydrationScript, renderToStream } from "@solidjs/web"

import { getHtmlProps } from "@kobalte/solidbase/server"

import App from "~/app"

type RenderContext = {
  clientEntry?: string
}

export function render(request?: Request, context: RenderContext = {}) {
  return renderToStream(() => (
    <html {...getHtmlProps()}>
      <head>
        <meta charset="utf-8" />
        <meta content="width=device-width, initial-scale=1" name="viewport" />
        <link href="/favicon-96x96.png" rel="icon" sizes="96x96" type="image/png" />
        <link href="/favicon.svg" rel="icon" type="image/svg+xml" />
        <link href="/favicon.ico" rel="shortcut icon" />
        <link href="/apple-touch-icon.png" rel="apple-touch-icon" sizes="180x180" />
        <meta content="SolidUI" name="apple-mobile-web-app-title" />
        <link href="/site.webmanifest" rel="manifest" />
        <HydrationScript />
        <script src={context.clientEntry ?? "/src/entry-client.tsx"} type="module" />
      </head>
      <body class="style-vega overscroll-none font-sans text-foreground antialiased [--footer-height:calc(var(--spacing)*14)] [--header-height:calc(var(--spacing)*14)]">
        <div id="app">
          <App url={request?.url} />
        </div>
      </body>
    </html>
  ))
}
