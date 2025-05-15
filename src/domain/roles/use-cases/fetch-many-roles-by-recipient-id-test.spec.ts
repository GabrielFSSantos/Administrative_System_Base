import { generateNameValueObject } from 'test/fakes/users/value-objects/fake-generate-name'
import { generatePermissionValueObject } from 'test/fakes/users/value-objects/fake-generate-permissions.'
import { InMemoryRolesRepository } from 'test/repositories/in-memory-roles-repository'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Role } from '@/domain/roles/entities/role'
import { FetchManyRolesByRecipientIdUseCase } from '@/domain/roles/use-cases/fetch-many-roles-by-recipient-id-use-case'
import { Permissions } from '@/shared/permissions'

import { FetchManyRolesByRecipientIdContract } from './contracts/fetch-many-roles-by-recipient-id-contract'

describe('Fetch Many Roles By RecipientId Test', () => {
  let inMemoryRolesRepository: InMemoryRolesRepository
  let sut: FetchManyRolesByRecipientIdContract

  beforeEach(() => {
    inMemoryRolesRepository = new InMemoryRolesRepository()
    sut = new FetchManyRolesByRecipientIdUseCase(inMemoryRolesRepository)
  })

  it('should return paginated roles by recipientId', async () => {
    const recipientId = new UniqueEntityId('company-1')

    for (let i = 0; i < 10; i++) {
      await inMemoryRolesRepository.create(
        Role.create({
          recipientId,
          name: generateNameValueObject(`Role ${String.fromCharCode(65 + i)}`),
          permissions: [generatePermissionValueObject(Permissions.USERS.VIEW)],
        }),
      )
    }

    const result = await sut.execute({
      recipientId: recipientId.toString(),
      page: 1,
      pageSize: 5,
    })

    expect(result.isRight()).toBe(true)

    if (result.isRight()) {
      expect(result.value.roles).toHaveLength(5)
      expect(result.value.roles[0].recipientId.toString()).toBe(recipientId.toString())
    }
  })

  it('should return all roles for recipientId when pageSize is large enough', async () => {
    const recipientId = new UniqueEntityId('company-2')

    await inMemoryRolesRepository.create(
      Role.create({
        recipientId,
        name: generateNameValueObject('Admin'),
        permissions: [generatePermissionValueObject(Permissions.USERS.CREATE)],
      }),
    )

    await inMemoryRolesRepository.create(
      Role.create({
        recipientId,
        name: generateNameValueObject('Editor'),
        permissions: [generatePermissionValueObject(Permissions.USERS.EDIT)],
      }),
    )

    const result = await sut.execute({
      recipientId: recipientId.toString(),
      page: 1,
      pageSize: 10,
    })

    expect(result.isRight()).toBe(true)

    if (result.isRight()) {
      expect(result.value.roles).toHaveLength(2)
      expect(result.value.roles.map((r) => r.name.value)).toEqual(expect.arrayContaining(['Admin', 'Editor']))
    }
  })

  it('should return empty array if no roles exist for recipientId', async () => {
    const result = await sut.execute({
      recipientId: new UniqueEntityId('non-existent').toString(),
      page: 1,
      pageSize: 10,
    })

    expect(result.isRight()).toBe(true)

    if (result.isRight()) {
      expect(result.value.roles).toHaveLength(0)
    }
  })
})
