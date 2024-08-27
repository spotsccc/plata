import NextLink from "next/link";
import { PropsWithChildren } from "react";
import styles from "./styles.module.css";

type Props = PropsWithChildren<{
  href: string;
}>;

export function Link({ href, children }: Props) {
  return (
    <NextLink href={href} className={styles.link}>
      {children}
    </NextLink>
  );
}
