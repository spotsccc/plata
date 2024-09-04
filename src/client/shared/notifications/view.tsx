import { Box, List, ListItem, Notification } from "@mantine/core";
import { useUnit } from "effector-react";
import { $notifications } from "./model";

export function Notifications() {
  const { notifications } = useUnit({ notifications: $notifications });
  return (
    <Box pos="absolute" bottom="20" left="20">
      <List listStyleType="none">
        {notifications.map(({ title, message, type }) => (
          <ListItem>
            <Notification title={title}>{message}</Notification>
          </ListItem>
        ))}
      </List>
    </Box>
  );
}
