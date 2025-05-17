import { makeUser } from 'test/factories/users/make-user'
import { generatePasswordHashValueObject } from 'test/factories/users/value-objects/make-password-hash'
import { generateEmailValueObject } from 'test/factories/value-objects/make-email'
import { generateNameValueObject } from 'test/factories/value-objects/make-name'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { User } from '@/domain/users/entities/user'
import { CPF } from '@/domain/users/entities/value-objects/cpf'
import { PasswordHash } from '@/domain/users/entities/value-objects/password-hash'
import { InvalidUpdatedAtError } from '@/shared/errors/invalid-updated-at-error'
import { EmailAddress } from '@/shared/value-objects/email-address'
import { Name } from '@/shared/value-objects/name'

describe('User Entity Test', () => {
  it('should create a valid user with makeUser()', async () => {
    const user = await makeUser()

    expect(user).toBeInstanceOf(User)
    expect(user.name).toBeInstanceOf(Name)
    expect(user.emailAddress).toBeInstanceOf(EmailAddress)
    expect(user.cpf).toBeInstanceOf(CPF)
    expect(user.passwordHash).toBeInstanceOf(PasswordHash)
  })

  it('should not create user if updatedAt is before createdAt', async () => {
    const createdAt = new Date('2025-01-02')
    const updatedAt = new Date('2025-01-01')

    const baseUser = await makeUser()

    const result = User.create(
      {
        cpf: baseUser.cpf,
        name: baseUser.name,
        emailAddress: baseUser.emailAddress,
        passwordHash: baseUser.passwordHash,
        createdAt,
        updatedAt,
      },
    )

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(InvalidUpdatedAtError)
  })

  it('should update name and refresh updatedAt', async () => {
    const user = await makeUser()
    const before = user.updatedAt

    const newName = generateNameValueObject()

    user.changeName(newName)

    expect(user.name).toBe(newName)
    expect(user.updatedAt?.getTime()).toBeGreaterThan(before?.getTime() ?? 0)
  })

  it('should update email and refresh updatedAt', async () => {
    const user = await makeUser()
    const before = user.updatedAt

    const newEmail = generateEmailValueObject()

    user.changeEmail(newEmail)

    expect(user.emailAddress).toBe(newEmail)
    expect(user.updatedAt?.getTime()).toBeGreaterThan(before?.getTime() ?? 0)
  })

  it('should update password hash and refresh updatedAt', async () => {
    const user = await makeUser()
    const before = user.updatedAt

    const newPasswordHash = await generatePasswordHashValueObject()

    user.changePasswordHash(newPasswordHash)

    expect(user.passwordHash).toBe(newPasswordHash)
    expect(user.updatedAt?.getTime()).toBeGreaterThan(before?.getTime() ?? 0)
  })

  it('should set createdAt and updatedAt correctly if not provided', async () => {
    const user = await makeUser()

    expect(user.createdAt).toBeInstanceOf(Date)
    expect(user.updatedAt).toBeNull()
  })

  it('should accept override values in makeUser', async () => {
    const customName = generateNameValueObject()
    const user = await makeUser({ name: customName })

    expect(user.name).toBe(customName)
  })

  it('should preserve provided UniqueEntityId', async () => {
    const customId = new UniqueEntityId()
    const user = await makeUser({}, customId)

    expect(user.id).toEqual(customId)
  })
})
