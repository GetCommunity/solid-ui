import { createRouter } from "@solidjs/router"
import { fileRoutes } from "@solidjs/router/fs"

import { SolidBaseRoot } from "@kobalte/solidbase/client"

import { pageRoutes } from "virtual:file-routes"

import "~/styles/globals.css"

const Router = createRouter({ routes: fileRoutes(pageRoutes) })

export default function App(props: { url?: string }) {
  return (
    <Router url={props.url}>{(route) => <SolidBaseRoot>{route.children}</SolidBaseRoot>}</Router>
  )
}
