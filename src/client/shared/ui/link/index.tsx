import NextLink from "next/link";
import { PropsWithChildren } from "react";
import styles from "./styles.module.css";
import clsx from "clsx";

type Props = PropsWithChildren<{
  href: string;
  className?: string;
  style?: any;
}>;

export function Link({ href, children, className, style }: Props) {
  return (
    <NextLink
      href={href}
      className={clsx(styles.link, className)}
      style={style}
    >
      {children}
    </NextLink>
  );
}
