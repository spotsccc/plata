import {
  Group,
  List,
  ListItem,
  Stack,
  UnstyledButton,
  Text,
  Title,
} from "@mantine/core";
import { useUnit } from "effector-react";
import { TransactionType } from "~/server/modules/finance/models/transaction";
import { typeSelected } from "../model";
import { Header } from "./header";

function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function TypeScreen() {
  const { typeSelectHandler } = useUnit({ typeSelectHandler: typeSelected });
  return (
    <Stack p="lg">
      <Header title="Select transaction type:" disableBackArrow />
      <List
        listStyleType="none"
        spacing="sm"
        h="100%"
        style={{ overflow: "scroll" }}
      >
        {Object.keys(TransactionType).map((type) => (
          <ListItem key={type}>
            <UnstyledButton
              onClick={() => typeSelectHandler(type as TransactionType)}
            >
              <Group>
                <Text size="xl">{capitalizeFirstLetter(type)}</Text>
              </Group>
            </UnstyledButton>
          </ListItem>
        ))}
      </List>
    </Stack>
  );
}
