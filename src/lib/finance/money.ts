export type Money = {
  amount: string;
  currency: string;
  accuracy: number;
};

export function minus(current: Money, diff: Money): Money {
  if (current.accuracy > diff.accuracy) {
    const accuracyDiff = current.accuracy - diff.accuracy;

    const amount =
      BigInt(current.amount) - BigInt(diff.amount) * BigInt(10 ** accuracyDiff);

    if (amount < 0) {
      throw new Error("Amount is negative");
    }

    return {
      accuracy: current.accuracy,
      currency: current.currency,
      amount: (
        BigInt(current.amount) -
        BigInt(diff.amount) * BigInt(10 ** accuracyDiff)
      ).toString(),
    };
  }

  const accuracyDiff = diff.accuracy - current.accuracy;

  const amount =
    BigInt(current.amount) * BigInt(10 ** accuracyDiff) - BigInt(diff.amount);

  if (amount < 0) {
    throw new Error("Amount is negative");
  }

  return {
    accuracy: diff.accuracy,
    currency: current.currency,
    amount: (
      BigInt(current.amount) * BigInt(10 ** accuracyDiff) -
      BigInt(diff.amount)
    ).toString(),
  };
}

export function plus(current: Money, diff: Money): Money {
  if (current.accuracy > diff.accuracy) {
    const accuracyDiff = current.accuracy - diff.accuracy;

    return {
      accuracy: current.accuracy,
      currency: current.currency,
      amount: (
        BigInt(current.amount) +
        BigInt(diff.amount) * BigInt(10 ** accuracyDiff)
      ).toString(),
    };
  }

  const accuracyDiff = diff.accuracy - current.accuracy;

  return {
    accuracy: diff.accuracy,
    currency: current.currency,
    amount: (
      BigInt(current.amount) * BigInt(10 ** accuracyDiff) +
      BigInt(diff.amount)
    ).toString(),
  };
}

export function createEmptyMoney(currency: string): Money {
  return {
    amount: "0",
    accuracy: 0,
    currency,
  };
}
