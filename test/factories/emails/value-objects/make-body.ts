import { Body } from '@/domain/emails/entities/value-objects/body'

export function generateValidBody(): string {
  return 'Olá, este é o corpo do e-mail com conteúdo informativo válido.'
}

export function generateBodyValueObject(value?: string): Body {
  const bodyOrError = Body.create(value ?? generateValidBody())

  if (bodyOrError.isLeft()) {
    throw bodyOrError.value
  }

  return bodyOrError.value
}
