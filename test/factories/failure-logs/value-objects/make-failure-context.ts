import { FailureContext } from '@/domain/failure-logs/entities/value-objects/failure-context'

export function generateFailureContextValueObject(value = 'DefaultContext'): FailureContext {
  const context = FailureContext.create(value)

  if (context.isLeft()) {
    throw context.value
  }

  return context.value
}
