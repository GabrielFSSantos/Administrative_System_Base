import { Either, left, right } from '@/core/either'

import { PermissionName } from '../entities/value-objects/permission-name'
import { InvalidPermissionError } from '../use-cases/errors/invalid-permission-error'

export function validateAndParsePermissions(raw: string[]): Either<InvalidPermissionError, PermissionName[]> {
  const invalid = raw.filter((p) => !PermissionName.verify(p))

  if (invalid.length > 0) {
    return left(new InvalidPermissionError(invalid))
  }

  return right(raw.map((value) => PermissionName.parse(value)))
}
