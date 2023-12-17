import { Money } from "models"

export function formatMoney({ money }: { money: Money }) {
  let left = money.amount.slice(0, money.amount.length - money.accuracy)
  if (left.length === 0) {
    left = "0"
  }
  let right = money.amount.slice(money.amount.length - money.accuracy)
  if (right.length < 2) {
    right = `0${right}`
  }
  return `${left}.${right} ${money.currency.code}`
}
