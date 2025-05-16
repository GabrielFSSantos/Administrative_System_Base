export class Left<L extends Error, R = never> {
  readonly value: L

  constructor(value: L) {
    this.value = value
  }

  isRight(): this is Right<L, R> {
    return false
  }

  isLeft(): this is Left<L, R> {
    return true
  }
}

export class Right<L extends Error = never, R = unknown> {
  readonly value: R

  constructor(value: Exclude<R, Error>) {
    this.value = value
  }

  isRight(): this is Right<L, R> {
    return true
  }

  isLeft(): this is Left<L, R> {
    return false
  }
}

export type Either<L extends Error, R> = Left<L, R> | Right<L, R>

export function left<L extends Error, R = never>(value: L): Either<L, R> {
  return new Left(value)
}

export function right<R, L extends Error = never>(value: Exclude<R, Error>): Either<L, R> {
  return new Right(value)
}
