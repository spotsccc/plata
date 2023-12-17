export type Money = {
  amount: string
  accuracy: number
  currency: Currency
}

export type Currency = {
  code: CurrencyCode
}

export enum CurrencyCode {
  RUB = "RUB",
  USD = "USD",
  GEL = "GEL",
  USDT = "USDT",
  BTC = "BTC",
  ETH = "ETH",
  ARS = "ARS",
}
