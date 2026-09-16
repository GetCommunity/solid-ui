// @refresh reload
import { hydrate } from "@solidjs/web"

import App from "~/app"

// biome-ignore lint/style/noNonNullAssertion: it's just how it works <3
hydrate(() => <App />, document.getElementById("app")!)
