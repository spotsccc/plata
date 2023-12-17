import { Avatar } from "@radix-ui/react-avatar"
import { RowsIcon } from "@radix-ui/react-icons"

import { Button } from "../button"

export type HeaderProps = {
  pageName: string
}
export function Header({ pageName }: HeaderProps) {
  return (
    <header className="flex justify-between p-3">
      <Burger />
      <h1>{pageName}</h1>
      <Avatar />
    </header>
  )
}

export function Burger() {
  return (
    <Button>
      <RowsIcon />
    </Button>
  )
}
