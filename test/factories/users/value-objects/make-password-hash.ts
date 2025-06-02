
import { FakeHasher } from 'test/fakes/services/cryptography/fake-hasher'

import { PasswordHash } from '@/domain/users/entities/value-objects/password-hash'

export function generateValidPassword(): string {
  return 'Strong@123'
}

export async function generatePasswordHashValueObject(
  password?: string,
): Promise<PasswordHash> {
  const result = await PasswordHash.createFromPlain(new FakeHasher(), password ?? generateValidPassword())

  if (result.isLeft()) {
    throw result.value 
  }

  return result.value
}
