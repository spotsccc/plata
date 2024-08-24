export type Success<S> = {
  tag: "success";
  success: S;
};

export type Error<E> = {
  tag: "error";
  error: E;
};

export type Result<S, E> = Success<S> | Error<E>;

export function createSuccess<S>(s: S): Success<S> {
  return {
    tag: "success",
    success: s,
  };
}

export function createError<E>(e: E): Error<E> {
  return {
    tag: "error",
    error: e,
  };
}

export function isSuccess<S, E>(r: Result<S, E>): r is Success<S> {
  return r.tag === "success";
}

export function isError<S, E>(r: Result<S, E>): r is Error<E> {
  return r.tag === "error";
}
