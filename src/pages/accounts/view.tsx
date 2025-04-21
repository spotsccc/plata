import { reatomComponent } from "@reatom/react";
import { $user } from "../../lib/auth/user";

import { $accounts } from "./model";
import { Button, Stack } from "@mantine/core";
import { Link, Navigate } from "@tanstack/react-router";

export const AccountsPage = reatomComponent(() => {
  if (!$user()) {
    return <Navigate to="/auth" />;
  }

  if ($accounts.pending() > 0) {
    return <div>Loading...</div>;
  }

  if ($accounts.error()) {
    return <div>Error</div>;
  }

  return (
    <Stack>
      {$accounts.data()?.map((account) => (
        <Link to={`/accounts/$id`} params={{ id: account.id }}>
          {account.name}
        </Link>
      ))}
      <Button component={Link} to="/accounts/create">
        Create Account
      </Button>
    </Stack>
  );
});
