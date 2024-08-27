import "@mantine/core/styles.css";

import { EffectorNext } from "@effector/next";
import { AppProps } from "next/app";
import {
  createTheme,
  CSSVariablesResolver,
  MantineProvider,
} from "@mantine/core";
import { Notifications } from "~/shared/notifications/view";
import "./styles.css";

const resolver: CSSVariablesResolver = (theme) => ({
  variables: {},
  light: {},
  dark: {},
});

const theme = createTheme({});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <EffectorNext values={pageProps.values}>
      <MantineProvider
        defaultColorScheme="dark"
        theme={theme}
        cssVariablesResolver={resolver}
      >
        <Notifications />
        <Component {...pageProps} />
      </MantineProvider>
    </EffectorNext>
  );
}
