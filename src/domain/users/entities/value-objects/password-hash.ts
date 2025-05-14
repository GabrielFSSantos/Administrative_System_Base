import { HashComparerContract } from '@/core/contracts/cryptography/hash-comparer-contract'
import { HashGeneratorContract } from '@/core/contracts/cryptography/hash-generator-contract'
import { ValueObject } from '@/core/entities/value-object'

import { InvalidPasswordHashError } from './errors/invalid-password-hash-error'
import { WeakPasswordError } from './errors/weak-password-error'

interface PasswordHashProps {
  value: string
}

export class PasswordHash extends ValueObject<PasswordHashProps> {
  get value(): string {
    return this.props.value
  }

  private static isValidHash(hash: string): boolean {
    return typeof hash === 'string' &&
      /^\$2[aby]\$\d{2}\$[./A-Za-z0-9]{53}$/.test(hash)
  }

  private static isStrongPassword(password: string): boolean {
    const minLength = 6
    const hasUppercase = /[A-Z]/.test(password)
    const hasNumber = /\d/.test(password)
    const hasSpecial = /[^A-Za-z0-9]/.test(password)

    return password.length >= minLength && hasUppercase && hasNumber && hasSpecial
  }

  public async compareWith(
    plain: string,
    comparer: HashComparerContract,
  ): Promise<boolean> {
    return comparer.compare(plain, this.value)
  }

  public static fromHashed(hash: string): PasswordHash {
    if (!this.isValidHash(hash)) {
      throw new InvalidPasswordHashError()
    }

    return new PasswordHash({ value: hash })
  }

  public static async generateFromPlain(
    plain: string,
    hasher: HashGeneratorContract,
  ): Promise<PasswordHash> {
    if (!this.isStrongPassword(plain)) {
      throw new WeakPasswordError()
    }

    const hashed = await hasher.generate(plain)

    return this.fromHashed(hashed)
  }
}
