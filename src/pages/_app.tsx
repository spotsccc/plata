import "@mantine/core/styles.css";

import { EffectorNext } from "@effector/next";
import { AppProps } from "next/app";
import { createTheme, MantineProvider } from "@mantine/core";

const theme = createTheme({
  /** Put your mantine theme override here */
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <EffectorNext values={pageProps.values}>
      <MantineProvider defaultColorScheme="dark" theme={theme}>
        <Component {...pageProps} />
      </MantineProvider>
    </EffectorNext>
  );
}
