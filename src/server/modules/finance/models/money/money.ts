export type Money = {
  amount: string;
  accuracy: number;
  currency: Currency;
};

export enum Currency {
  BTC = "BTC",
  USD = "USD",
  USDT = "USDT",
  ARS = "ARS",
  RUB = "RUB",
  DOT = "DOT",
  ATOM = "ATOM",
  ETH = "ETH",
  FLOKI = "FLOKI",
  PEPE = "PEPE",
  W = "W",
  ARB = "ARB",
  HFT = "HFT",
  GLMR = "GLMR",
  XRP = "XRP",
  SOL = "SOL",
  DOGE = "DOGE",
  TRX = "TRX",
  ADA = "ADA",
  TON = "TON",
}

export function createEmptyMoney(currency: Currency): Money {
  return {
    amount: "0",
    accuracy: 0,
    currency,
  };
}
