
import { describe, expect,it } from 'vitest'

import { InvalidPasswordHashError } from '@/domain/users/entities/value-objects/errors/invalid-password-hash-error'
import { WeakPasswordError } from '@/domain/users/entities/value-objects/errors/weak-password-error'
import { PasswordHash } from '@/domain/users/entities/value-objects/password-hash'
import { WrongCredentialsError } from '@/domain/users/use-cases/errors/wrong-credentials-error'

class FakeHasher {
  async generate(_plain: string): Promise<string> {
    return `$2a$10$${'a'.repeat(53)}`
  }

  async compare(plain: string, hash: string): Promise<boolean> {
    return hash.includes('valid') && plain === 'Valid@123'
  }
}

describe('PasswordHashValueObjectTest', () => {
  it('should create a valid hash from plain password', async () => {
    const result = await PasswordHash.createFromPlain(new FakeHasher(), 'Valid@123')

    expect(result.isRight()).toBe(true)
    expect(result.value).toBeInstanceOf(PasswordHash)
  })

  it('should return error if password is weak', async () => {
    const result = await PasswordHash.createFromPlain(new FakeHasher(), 'weak')

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(WeakPasswordError)
  })

  it('should create a PasswordHash from valid hash string', () => {
    const validHash = '$2a$10$' + 'a'.repeat(53)
    const result = PasswordHash.createFromHashed(validHash)

    expect(result.isRight()).toBe(true)
    expect(result.value).toBeInstanceOf(PasswordHash)
  }) 

  it('should return error if hash is malformed', () => {
    const result = PasswordHash.createFromHashed('invalid-hash')

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(InvalidPasswordHashError)
  })

  it('should return true when comparing correct password', async () => {
    const validHash = '$2a$10$valid'.padEnd(60, 'a')
    const hash = PasswordHash.createFromHashed(validHash)

    if (hash.isRight()) {
      const result = await hash.value.compareWith(new FakeHasher(), 'Valid@123')

      expect(result.isRight()).toBe(true)
      expect(result.value).toBe(true)
    }
  })

  it('should return WrongCredentialsError for incorrect password', async () => {
    const validHash = '$2a$10$valid'.padEnd(60, 'a')
    const hash = PasswordHash.createFromHashed(validHash)

    if (hash.isRight()) {
      const result = await hash.value.compareWith(new FakeHasher(), 'Wrong@123')

      expect(result.isLeft()).toBe(true)
      expect(result.value).toBeInstanceOf(WrongCredentialsError)
    }
  })

  it('should compare PasswordHash equality based on value', () => {
    const hashA = PasswordHash.createFromHashed('$2a$10$' + 'a'.repeat(53))
    const hashB = PasswordHash.createFromHashed('$2a$10$' + 'a'.repeat(53))

    expect(hashA.isRight()).toBe(true)
    expect(hashB.isRight()).toBe(true)

    if (hashA.isRight() && hashB.isRight()) {
      expect(hashA.value.equals(hashB.value)).toBe(true)
    }
  })
})
