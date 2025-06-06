import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { FailureLog, FailureLogProps } from '@/domain/failure-logs/entities/failure-log'

import { generateFailureContextValueObject } from './value-objects/make-failure-context'
import { generateFailureErrorMessageValueObject } from './value-objects/make-failure-error-message'
import { generateFailureErrorNameValueObject } from './value-objects/make-failure-error-name'

export function makeFailureLog(
  override: Partial<FailureLogProps> = {},
  id?: UniqueEntityId,
) {
  const context = override.context ?? generateFailureContextValueObject()
  const errorName = override.errorName ?? generateFailureErrorNameValueObject()
  const errorMessage = override.errorMessage ?? generateFailureErrorMessageValueObject()

  const failureLog = FailureLog.create(
    {
      context,
      errorName,
      errorMessage,
      payload: override.payload,
      stack: override.stack,
      createdAt: override.createdAt ?? new Date(),
    },
    id,
  )

  return failureLog
} 
