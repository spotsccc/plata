import "@mantine/core/styles.css";
import { $ready } from "./lib/auth/user";
import { reatomComponent } from "@reatom/react";

import { RouterProvider } from "@tanstack/react-router";
import { router } from "./router";

export const App = reatomComponent(() => {
  if (!$ready()) {
    return <div>Loading...</div>;
  }

  return <RouterProvider router={router} />;
});
