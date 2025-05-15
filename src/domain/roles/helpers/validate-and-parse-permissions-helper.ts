import { Either, left, right } from '@/core/either'

import { InvalidPermissionNameError } from '../entities/value-objects/errors/invalid-permission-name-error'
import { PermissionName } from '../entities/value-objects/permission-name'
import { InvalidPermissionError } from '../use-cases/errors/invalid-permission-error'

export function validateAndParsePermissions(
  raw: string[],
): Either<InvalidPermissionError, PermissionName[]> {
  const results = raw.map((value) => PermissionName.parse(value))

  const invalids = results.filter((result) => result.isLeft()) as Array<
    Either<InvalidPermissionNameError, never>
  >

  if (invalids.length > 0) {
    const values = invalids.map((i) => i.value.message)

    return left(new InvalidPermissionError(values))
  }

  const valids = results.map((r) => r.value as PermissionName)

  return right(valids)
}
