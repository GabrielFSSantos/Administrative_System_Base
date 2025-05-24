import { CNPJ } from '@/domain/companies/entities/value-objects/cnpj'

export function generateValidCNPJ(): string {
  const randomDigits = (): number[] =>
    Array.from({ length: 12 }, () => Math.floor(Math.random() * 10))

  const calcCheckDigit = (digits: number[]): number => {
    const factors = digits.length === 12
      ? [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
      : [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]

    const sum = digits.reduce((acc, digit, index) => acc + digit * factors[index], 0)
    const mod = sum % 11

    return mod < 2 ? 0 : 11 - mod
  }

  const base = randomDigits()
  const digit1 = calcCheckDigit(base)
  const digit2 = calcCheckDigit([...base, digit1])

  return [...base, digit1, digit2].join('')
}

export function generateCNPJValueObject(value?: string): CNPJ {
  const cnpjObject = CNPJ.create(value ?? generateValidCNPJ())

  if (cnpjObject.isLeft()) {
    throw cnpjObject.value
  }

  return cnpjObject.value
}
