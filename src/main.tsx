import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App.tsx";

import { reatomContext } from "@reatom/react";
import { MantineProvider } from "@mantine/core";
import { initialize } from "./lib/auth/user";
import { ctx } from "./ctx";
import { connectLogger } from "@reatom/core";

connectLogger();

ctx.run(initialize);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <MantineProvider>
      <reatomContext.Provider value={ctx}>
        <App />
      </reatomContext.Provider>
    </MantineProvider>
  </StrictMode>
);
