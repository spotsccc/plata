import { Money } from "./money";

export function minus(current: Money, diff: Money): Money {
  if (current.accuracy > diff.accuracy) {
    const accuracyDiff = current.accuracy - diff.accuracy;

    const amount =
      BigInt(current.amount) - BigInt(diff.amount) * BigInt(10 ** accuracyDiff);

    if (amount < 0) {
      // return error
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
    // return error
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
