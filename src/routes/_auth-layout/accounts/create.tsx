import { createFileRoute } from "@tanstack/react-router";
import { CreateAccountPage } from "../../../pages/create-account";

export const Route = createFileRoute("/_auth-layout/accounts/create")({
  component: CreateAccountPage,
});
