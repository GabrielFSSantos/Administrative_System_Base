import { Name } from '@/shared/value-objects/name'

const firstNames = [
  'Lucas', 'Ana', 'Rafael', 'Marina', 'Carlos', 'Juliana', 'Eduardo', 'Fernanda',
]

export function generateValidName(): string {
  const index = Math.floor(Math.random() * firstNames.length)

  return firstNames[index]
}

export function generateNameValueObject(): Name {
  return Name.create(generateValidName())
}