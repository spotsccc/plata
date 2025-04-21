import { context, clearStack } from "@reatom/core";

clearStack();

export const ctx = context.start();
