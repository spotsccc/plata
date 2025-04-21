import { Button, Card, Stack, Title } from "@mantine/core";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../../firebase";

export function AuthPage() {
  return (
    <Stack w="100dvw" h="100dvh" justify="center" align="center">
      <Card>
        <Title>Login with gmail account</Title>
        <Button onClick={() => signInWithPopup(auth, googleProvider)}>
          Login with gmail
        </Button>
      </Card>
    </Stack>
  );
}
