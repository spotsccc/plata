import { Group, UnstyledButton, Title } from "@mantine/core";
import CrossIcon from "~/client/shared/ui/icons/cross.svg";
import ArrowLeft from "~/client/shared/ui/icons/arrow-left.svg";
import { useUnit } from "effector-react";
import { backButtonPressed, crossButtonPressed } from "../model/navigation";

type Props = {
  title: string;
  disableBackArrow?: boolean;
  disableCrossArrow?: boolean;
  disableIcons?: boolean;
};

export function Header({
  title,
  disableIcons,
  disableCrossArrow,
  disableBackArrow,
}: Props) {
  const { backHandler, crossHandler } = useUnit({
    backHandler: backButtonPressed,
    crossHandler: crossButtonPressed,
  });
  return (
    <Group justify="space-between">
      <UnstyledButton onClick={backHandler} h={24}>
        {!disableIcons && !disableBackArrow && (
          <ArrowLeft height={24} width={24} fill="white" />
        )}
      </UnstyledButton>
      <Title size="h4">{title}</Title>
      <UnstyledButton h={24} onClick={crossHandler}>
        {!disableIcons && !disableCrossArrow && (
          <CrossIcon height={24} width={24} fill="white" />
        )}
      </UnstyledButton>
    </Group>
  );
}
