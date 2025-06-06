import { FailureErrorMessage } from '@/domain/failure-logs/entities/value-objects/failure-error-message'

export function generateFailureErrorMessageValueObject(value = 'Something went wrong'): FailureErrorMessage {
  const errorMessage = FailureErrorMessage.create(value)

  if (errorMessage.isLeft()) {
    throw errorMessage.value
  }

  return errorMessage.value
}
