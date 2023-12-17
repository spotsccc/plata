import "./global.css"
import { createHistoryRouter } from "atomic-router"
import { createRoutesView, RouterProvider } from "atomic-router-react"
import { createBrowserHistory } from "history"

import { accountRoute, accountsRoute, authRoute } from "@/shared/router"
import { AuthPage } from "@/pages/auth"
import { ThemeProvider } from "@/shared/ui/provider"
import { AccountsPage } from "@/pages/accounts"
import { AccountPage } from "@/pages/account"

const Routes = createRoutesView({
  routes: [
    { route: authRoute, view: AuthPage },
    { route: accountsRoute, view: AccountsPage },
    { route: accountRoute, view: AccountPage },
  ],
  otherwise: () => <div>123123</div>,
})

export function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <RouterProvider router={router}>
        <Routes />
      </RouterProvider>
    </ThemeProvider>
  )
}

export const router = createHistoryRouter({
  routes: [
    { route: accountsRoute, path: "/accounts" },
    { route: authRoute, path: "/auth" },
    { route: accountRoute, path: "/account/:id" },
  ],
})

const history = createBrowserHistory()

router.setHistory(history)
