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

  private static isValid(cpf: string): boolean {
    const cleaned = this.normalize(cpf)

    if (!/^\d{11}$/.test(cleaned)) return false

    if (/^(\d)\1{10}$/.test(cleaned)) return false

    const calcCheckDigit = (cpf: string, length: number) => {
      let sum = 0

      for (let i = 0; i < length; i++) {
        sum += parseInt(cpf.charAt(i)) * (length + 1 - i)
      }
      const result = (sum * 10) % 11

      return result === 10 ? 0 : result
    }

    const digit1 = calcCheckDigit(cleaned, 9)
    const digit2 = calcCheckDigit(cleaned, 10)

    return (
      digit1 === parseInt(cleaned.charAt(9)) &&
      digit2 === parseInt(cleaned.charAt(10))
    )
  }

  public static create(raw: string): CPF {
    const normalized = this.normalize(raw)

    if (!this.isValid(normalized)) {
      throw new InvalidCPFError()
    }

    const cpf = new CPF({ value: normalized })

    return cpf
  }
}
