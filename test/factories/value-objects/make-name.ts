import { Name } from '@/shared/value-objects/name'

const firstNames = [
  'Lucas', 'Ana', 'Rafael', 'Marina', 'Carlos', 'Juliana', 'Eduardo', 'Fernanda',
]

export function generateValidName(): string {
  const index = Math.floor(Math.random() * firstNames.length)

  return firstNames[index]
}

export function generateNameValueObject(value?: string): Name {
  const nameObject = Name.create(value ?? generateValidName())
  
  if(nameObject.isLeft()) {
    throw nameObject.value
  }

  return nameObject.value
}