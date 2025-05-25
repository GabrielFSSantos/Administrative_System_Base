import { Either, left, right } from '@/core/either'
import { ValueObject } from '@/core/entities/value-object'

import { InvalidCPFError } from './errors/invalid-cpf-error'

interface CpfProps {
  value: string
}

export class CPF extends ValueObject<CpfProps> {
  get value(): string {
    return this.props.value
  }

  private static normalize(value: string): string {
    return value.replace(/[^\d]/g, '') // remove pontos, traços e espaços
  }

  private static isValid(value: string): boolean {

    if (!/^\d{11}$/.test(value)) return false

    if (/^(\d)\1{10}$/.test(value)) return false

    const calcCheckDigit = (cpf: string, length: number) => {
      let sum = 0

      for (let i = 0; i < length; i++) {
        sum += parseInt(cpf.charAt(i)) * (length + 1 - i)
      }
      const result = (sum * 10) % 11

      return result === 10 ? 0 : result
    }

    const digit1 = calcCheckDigit(value, 9)
    const digit2 = calcCheckDigit(value, 10)

    return (
      digit1 === parseInt(value.charAt(9)) &&
      digit2 === parseInt(value.charAt(10))
    )
  }

  public toString(): string {
    return this.value
  }

  public static create(value: string): Either<
    InvalidCPFError,
    CPF
  > {
    const normalized = this.normalize(value)

    if (!this.isValid(normalized)) {
      return left(new InvalidCPFError())
    }

    const cpf = new CPF({ value: normalized })

    return right(cpf)
  }
}
