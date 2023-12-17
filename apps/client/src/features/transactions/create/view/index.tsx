import { Button } from "@/shared/ui/button"
import { Dialog, DialogContent } from "@/shared/ui/dialog"
import { useUnit } from "effector-react"
import { $step, Step, creatingStarted } from "../model/step"
import { canceled } from "../model/submit"
import { SelectType } from "./select-type"
import { FillTransaction } from "./filling/common"
import { SelectSubAccount } from "./select-sub-account"

export function NewTransactionButton() {
  const { onClick } = useUnit({
    onClick: creatingStarted,
  })
  return <Button onClick={onClick}>create new transaction</Button>
}

export function NewTransactionModal() {
  const { creatingStep, onClose } = useUnit({
    creatingStep: $step,
    onClose: canceled,
  })
  const isOpened = creatingStep !== Step.notStarted
  const View = TRANSACTION_STEPS[creatingStep]
  return (
    <Dialog open={isOpened} onOpenChange={onClose}>
      <DialogContent>
        <View />
      </DialogContent>
    </Dialog>
  )
}

export function TransactionCreate() {
  return (
    <>
      <NewTransactionModal />
      <NewTransactionButton />
    </>
  )
}

const TRANSACTION_STEPS = {
  [Step.selectingSubAccount]: SelectSubAccount,
  [Step.selectingType]: SelectType,
  [Step.fillingTransaction]: FillTransaction,
  [Step.notStarted]: () => null,
}
