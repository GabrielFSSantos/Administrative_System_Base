import { Either, left, right } from '@/core/either'
import { ValueObject } from '@/core/entities/value-object'
import { HashComparerContract } from '@/shared/services/cryptography/contracts/hash-comparer-contract'
import { HashGeneratorContract } from '@/shared/services/cryptography/contracts/hash-generator-contract'

import { WrongCredentialsError } from '../../use-cases/errors/wrong-credentials-error'
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

  public toString(): string {
    return this.value
  }

  public async compareWith(
    comparer: HashComparerContract,
    plain: string,
  ): Promise<Either<
    WrongCredentialsError, 
    boolean
  >> {
    const result = await comparer.compare(plain, this.value)

    if(!result) {
      return left(new WrongCredentialsError())
    }

    return right(result)
  }

  public static createFromHashed(
    hash: string,
  ): Either<InvalidPasswordHashError, PasswordHash> {
    if (!this.isValidHash(hash)) {
      return left(new InvalidPasswordHashError())
    }

    const hashValidated = new PasswordHash({ value: hash })

    return right(hashValidated)
  }

  public static async createFromPlain(
    hasher: HashGeneratorContract,
    plain: string,
  ): Promise<Either<
    WeakPasswordError | 
    InvalidPasswordHashError, 
    PasswordHash
  >> {
    if (!this.isStrongPassword(plain)) {
      return left(new WeakPasswordError())
    }

    const hashed = await hasher.generate(plain)

    const hashedvalidat = this.createFromHashed(hashed)

    if(hashedvalidat.isLeft()) {
      return left(hashedvalidat.value)
    }

    return right(hashedvalidat.value)
  }

}
