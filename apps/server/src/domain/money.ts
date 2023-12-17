import { CurrencyCode, Money as MoneyModel } from "models"

export class Money {
  public amount: string
  public currency: {
    code: CurrencyCode
  }

  public accuracy: number

  constructor({ amount, currency, accuracy }: MoneyModel) {
    this.accuracy = accuracy
    this.currency = currency
    this.amount = amount
  }

  public json(): MoneyModel {
    return {
      accuracy: this.accuracy,
      currency: this.currency,
      amount: this.amount,
    }
  }

  public plus(money: Money) {
    if (money.currency.code !== this.currency.code) {
      throw new Error("Trying plus money with different currency codes")
    }
    const normilizedMoney = this.normilize(money)
    this.amount = (
      BigInt(normilizedMoney.amount) + BigInt(this.amount)
    ).toString()
  }

  public minus(money: Money) {
    if (money.currency.code !== this.currency.code) {
      throw new Error("Trying plus money with different currency codes")
    }
    const normilizedMoney = this.normilize(money)
    this.amount = (
      BigInt(this.amount) - BigInt(normilizedMoney.amount)
    ).toString()
  }

  private normilize(money: Money) {
    if (this.accuracy < money.accuracy) {
      const accuracyDiff = this.accuracy - money.accuracy
      this.accuracy = money.accuracy
      this.amount = (
        BigInt(this.amount) * BigInt(10 ** accuracyDiff)
      ).toString()
      return money
    }
    if (this.accuracy > money.accuracy) {
      const accuracyDiff = this.accuracy - money.accuracy
      return new Money({
        amount: (BigInt(money.amount) * BigInt(10 ** accuracyDiff)).toString(),
        accuracy: this.accuracy,
        currency: { code: money.currency.code },
      })
    }
    return money
  }
}
