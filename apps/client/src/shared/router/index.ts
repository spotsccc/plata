import { createRoute, createRouterControls } from "atomic-router"

export const controls = createRouterControls()
export const authRoute = createRoute()
export const transactionsRoute = createRoute()
export const accountsRoute = createRoute()
export const accountRoute = createRoute<{ id: string }>()
