import { faker } from '@faker-js/faker'
import { FakeHasher } from 'test/fakes/cryptography/fake-hasher'
import { generateValidCPF } from 'test/fakes/users/fake-generate-valid-cpf'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { User, UserProps} from '@/domain/users/entities/user'
import { CPF } from '@/domain/users/entities/value-objects/cpf'
import { EmailAddress } from '@/domain/users/entities/value-objects/email-address'
import { Name } from '@/domain/users/entities/value-objects/name'
import { PasswordHash } from '@/domain/users/entities/value-objects/password-hash'

export async function makeUser(
  override: Partial<UserProps> = {},
  id?: UniqueEntityId,
) {

  const cpf = CPF.create(generateValidCPF())
  const name = Name.create(faker.person.firstName())
  const emailAddress = EmailAddress.create(faker.internet.email())
  const passwordHash = await PasswordHash.generateFromPlain(faker.internet.password(), new FakeHasher)

  const user = User.create(
    {
      cpf,
      name,
      emailAddress,
      passwordHash,
      ...override,
    },
    id,
  )

  return user
}
