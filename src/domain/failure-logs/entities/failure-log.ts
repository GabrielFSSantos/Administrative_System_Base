import { Entity } from '@/core/entities/entity'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'

import { FailureContext } from './value-objects/failure-context'
import { FailureErrorMessage } from './value-objects/failure-error-message'
import { FailureErrorName } from './value-objects/failure-error-name'

export interface FailureLogProps {
  context: FailureContext
  errorName: FailureErrorName
  errorMessage: FailureErrorMessage
  payload?: unknown
  stack?: string
  createdAt: Date
}

export class FailureLog extends Entity<FailureLogProps> {
  get context() {
    return this.props.context
  }

  get errorName() {
    return this.props.errorName
  }

  get errorMessage() {
    return this.props.errorMessage
  }

  get payload() {
    return this.props.payload
  }

  get stack() {
    return this.props.stack
  }

  get createdAt() {
    return this.props.createdAt
  }

  static create(
    props: Optional<FailureLogProps, 'createdAt'>,
    id?: UniqueEntityId,
  ) {
    return new FailureLog(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    )
  }
}