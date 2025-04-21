import { Group, UnstyledButton, Title } from "@mantine/core";
import CrossIcon from "../../../../../ui/icons/cross.svg?react";
import ArrowLeft from "../../../../../ui/icons/arrow-left.svg?react";
import { prevStep } from "../model";
import { wrap } from "@reatom/core";
import { reatomComponent } from "@reatom/react";

export const Header = reatomComponent<{ title: string }>(({ title }) => {
  return (
    <Group justify="space-between" wrap="nowrap">
      <UnstyledButton onClick={wrap(prevStep)} h={24}>
        123
      </UnstyledButton>
      <Title size="h4">{title}</Title>
      <UnstyledButton h={24}>321</UnstyledButton>
    </Group>
  );
}, "Header");
