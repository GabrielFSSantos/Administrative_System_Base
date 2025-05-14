import { ValueObject } from '@/core/entities/value-object'

import { InvalidUserNameError } from './errors/invalid-user-name-error'

interface NameProps {
  value: string
}

export class Name extends ValueObject<NameProps> {

  get value(): string {
    return this.props.value
  }

  public static isValid(value: string): boolean {
    const trimmed = value.trim()

    // Regras:
    if (trimmed.length < 2 || trimmed.length > 100) return false

    // Permite letras, espaços e acentos. Rejeita números e símbolos especiais.
    const validPattern = /^[A-Za-zÀ-ÿ\s]+$/

    if (!validPattern.test(trimmed)) return false

    return true
  }

  private static normalize(value: string): string {
    return value
      .trim()
      .replace(/\s+/g, ' ') // remove espaços duplicados
      .replace(/\b\w/g, (char) => char.toUpperCase()) // capitaliza cada palavra
  }

  public static create(raw: string): Name {
    const normalized = this.normalize(raw)

    if (!this.isValid(normalized)) {
      throw new InvalidUserNameError()
    }

    const name = new Name({ value: normalized })

    return name
  }
}
