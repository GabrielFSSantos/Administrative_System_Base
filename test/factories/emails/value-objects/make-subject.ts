import { Subject } from '@/domain/emails/entities/value-objects/subject'

export function generateValidSubject(): string {
  return 'Assunto do E-mail'
}

export function generateSubjectValueObject(value?: string): Subject {
  const subjectOrError = Subject.create(value ?? generateValidSubject())

  if (subjectOrError.isLeft()) {
    throw subjectOrError.value
  }

  return subjectOrError.value
}
