import { Either, left, right } from '@/core/either'
import { ValueObject } from '@/core/entities/value-object'

import { InvalidCNPJError } from './errors/invalid-cnpj-error'

interface CnpjProps {
  value: string
}

export class CNPJ extends ValueObject<CnpjProps> {
  get value(): string {
    return this.props.value
  }

  private static normalize(value: string): string {
    return value.replace(/[\D]/g, '') // remove tudo que não for dígito
  }

  private static isValid(cnpj: string): boolean {
    if (!/\d{14}/.test(cnpj)) return false

    if (/^\d{14}$/.test(cnpj) && cnpj.split('').every((d) => d === cnpj[0])) return false

    const calcCheckDigit = (cnpj: string, weights: number[]) => {
      const sum = weights.reduce((acc, weight, i) => {
        return acc + parseInt(cnpj[i]) * weight
      }, 0)

      const remainder = sum % 11

      return remainder < 2 ? 0 : 11 - remainder
    }

    const base = cnpj.slice(0, 12)
    const digit1 = calcCheckDigit(base, [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2])
    const digit2 = calcCheckDigit(base + digit1, [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2])

    return cnpj.endsWith(`${digit1}${digit2}`)
  }

  public toString(): string {
    return this.value
  }

  public static create(value: string): Either<
    InvalidCNPJError,
    CNPJ
  > {
    const normalized = this.normalize(value)

    if (!this.isValid(normalized)) {
      return left(new InvalidCNPJError())
    }

    const cnpj = new CNPJ({ value: normalized })

    return right(cnpj)
  }
}
