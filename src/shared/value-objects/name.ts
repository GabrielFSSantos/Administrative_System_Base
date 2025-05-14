import { ValueObject } from '@/core/entities/value-object'

import { InvalidNameError } from './errors/invalid-name-error'

interface NameProps {
  value: string
}

export class Name extends ValueObject<NameProps> {

  get value(): string {
    return this.props.value
  }

  private static normalize(value: string): string {
    return value
      .trim()
      .replace(/\s+/g, ' ') // remove espaços duplicados
      .replace(/\b\w/g, (char) => char.toUpperCase()) // capitaliza cada palavra
  }

  private static isValid(value: string): boolean {

    // Regras:
    if (value.length < 3 || value.length > 50) return false

    // Permite letras, espaços e acentos. Rejeita números e símbolos especiais.
    const validPattern = /^[A-Za-zÀ-ÿ\s]+$/

    if (!validPattern.test(value)) return false

    return true
  }

  public static create(value: string): Name {
    const normalized = this.normalize(value)

    if (!this.isValid(normalized)) {
      throw new InvalidNameError()
    }

    const name = new Name({ value: normalized })

    return name
  }
}
