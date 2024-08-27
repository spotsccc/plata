import { TRPCClientError } from "@trpc/client";
import { typeToFlattenedError } from "zod";
import type { AppRouter } from "~/server/trpc-router";
import {} from "@farfetched/core";

export type ValidationError = Omit<TRPCClientError<AppRouter>, "data"> & {
  data: Omit<TRPCClientError<AppRouter>["data"], "validationError"> & {
    validationError: typeToFlattenedError<any, string>;
  };
};

export type ValidationErrorResponse = {
  error: ValidationError;
  params: any;
  meta: any;
};

export function isValidationErrorResponse(res: {
  error: unknown;
}): res is ValidationErrorResponse {
  return isValidationError(res.error);
}

export function isTRPCError(
  error: unknown,
): error is TRPCClientError<AppRouter> {
  return error instanceof TRPCClientError;
}

export function isValidationError(error: unknown): error is ValidationError {
  return isTRPCError(error) && !!error.data?.validationError;
}

export function getValidationError(
  error: ValidationError,
  key: string,
): string | null {
  const fieldErrors = error.data.validationError.fieldErrors[key] ?? [];
  return fieldErrors[0] ?? null;
}

export function isUnknownErrorResponse(res: { error: unknown }) {
  return !isValidationErrorResponse(res);
}
