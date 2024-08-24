import { Money } from "./model";

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
