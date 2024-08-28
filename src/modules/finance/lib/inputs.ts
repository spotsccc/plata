import { z } from "zod";
import { Currency } from "./model";

export const accountCreateInput = z.object({
  name: z.string().min(1),
  defaultCurrency: z.nativeEnum(Currency),
});

export type AccountCreateInput = z.infer<typeof accountCreateInput>;
