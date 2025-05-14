import { HashComparerContract } from '@/core/contracts/cryptography/hash-comparer-contract'
import { HashGeneratorContract } from '@/core/contracts/cryptography/hash-generator-contract'
import { ValueObject } from '@/core/entities/value-object'

import { InvalidPasswordHashError } from './errors/invalid-password-hash-error'

interface PasswordHashProps {
  value: string
}

export class PasswordHash extends ValueObject<PasswordHashProps> {
  get value(): string {
    return this.props.value
  }

  private static isValidHash(hash: string): boolean {
    // hash do bcrypt normalmente tem 60 caracteres e prefixo válido
    return typeof hash === 'string' &&
      /^\$2[aby]\$\d{2}\$[./A-Za-z0-9]{53}$/.test(hash)
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
    const hashed = await hasher.generate(plain)

    return this.fromHashed(hashed)
  }
}
