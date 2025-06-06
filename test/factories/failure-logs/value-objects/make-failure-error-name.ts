import { FailureErrorName } from '@/domain/failure-logs/entities/value-objects/failure-error-name'

export function generateFailureErrorNameValueObject(value = 'ErrorName'): FailureErrorName {
  const errorName = FailureErrorName.create(value)

  if (errorName.isLeft()) {
    throw errorName.value
  }

  return errorName.value
}
