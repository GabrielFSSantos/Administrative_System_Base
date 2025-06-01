import { Title } from '@/domain/emails/entities/value-objects/title'

export function generateValidTitle(): string {
  return 'Título do E-mail'
}

export function generateTitleValueObject(value?: string): Title {
  const titleOrError = Title.create(value ?? generateValidTitle())

  if (titleOrError.isLeft()) {
    throw titleOrError.value
  }

  return titleOrError.value
}
