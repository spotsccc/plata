import { useUnit } from "effector-react"

import { Button } from "@/shared/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
} from "@/shared/ui/dialog"
import { Input } from "@/shared/ui/input"

import {
  $creating,
  $name,
  createButtonClicked,
  nameChanged,
  creatingCanceled,
  submitted,
} from "./model"

export function CreateAccount() {
  const { onClick } = useUnit({
    onClick: createButtonClicked,
  })
  return (
    <>
      <Button className="h-full border-2" onClick={onClick}>
        +
      </Button>
      <CreateAccountDialog />
    </>
  )
}

export function CreateAccountDialog() {
  const { isOpened, onOpenChange } = useUnit({
    isOpened: $creating,
    onOpenChange: creatingCanceled,
  })
  return (
    <Dialog open={isOpened} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <p>Create sub account</p>
        </DialogHeader>
        <Name />
        <DialogFooter>
          <Cancel />
          <Submit />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export function Submit() {
  const { onClick } = useUnit({
    onClick: submitted,
  })
  return <Button onClick={onClick}>Create</Button>
}

export function Cancel() {
  const { onClick } = useUnit({
    onClick: creatingCanceled,
  })
  return <Button onClick={onClick}>Cancel</Button>
}

export function Name() {
  const { value, onChange } = useUnit({
    value: $name,
    onChange: nameChanged,
  })
  return (
    <Input
      label="Name"
      onChange={(e) => onChange(e.target.value)}
      value={value}
    />
  )
}
