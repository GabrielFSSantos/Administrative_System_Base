import { CPF } from '@/domain/users/entities/value-objects/cpf'

export function generateValidCPF(): string {
  const randomDigits = (): number[] =>
    Array.from({ length: 9 }, () => Math.floor(Math.random() * 10))

  const calcCheckDigit = (digits: number[]): number => {
    const factor = digits.length + 1
    const sum = digits.reduce((acc, digit, index) => acc + digit * (factor - index), 0)
    const mod = sum % 11

    return mod < 2 ? 0 : 11 - mod
  }

  const base = randomDigits()
  const digit1 = calcCheckDigit(base)
  const digit2 = calcCheckDigit([...base, digit1])

  return [...base, digit1, digit2].join('')
}

export function generateCPFValueObject(value?: string): CPF {
  return CPF.create(value ?? generateValidCPF())
}
