export function isValidAmount({ amount }: { amount: string }) {
  const regEx = /^\d*[.,]?\d{0,2}$/
  return regEx.test(amount)
}

export function normilizeAmount({ amount }: { amount: string }) {
  if (amount.length === 0) {
    return "0.00"
  }
  const [left, right] = amount.replace(",", ".").split(".")
  if (!right) {
    return `${left}.00`
  }
  if (right.length === 0) {
    return `${left}.00`
  }
  if (right.length === 1) {
    return `${left}.${right}0`
  }
  return `${left}.${right}`
}
