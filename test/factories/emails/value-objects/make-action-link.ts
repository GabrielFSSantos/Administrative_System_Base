import { ActionLink } from '@/domain/emails/entities/value-objects/action-link'

export function generateValidActionLink(): string {
  return 'https://example.com/action'
}

export function generateActionLinkValueObject(value?: string): ActionLink {
  const actionLinkOrError = ActionLink.create(value ?? generateValidActionLink())

  if (actionLinkOrError.isLeft()) {
    throw actionLinkOrError.value
  }

  return actionLinkOrError.value
}
