import { generatePermissionValueObject } from 'test/factories/roles/value-objects/make-permissions'
import { generateNameValueObject } from 'test/factories/value-objects/make-name'
import { InMemoryRolesRepository } from 'test/repositories/in-memory-roles-repository'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Role } from '@/domain/roles/entities/role'
import { FetchManyRolesByRecipientIdUseCase } from '@/domain/roles/use-cases/fetch-many-roles-by-recipient-id-use-case'
import { Permissions } from '@/shared/permissions'

describe('Fetch Many Roles By RecipientId Test', () => {
  let inMemoryRolesRepository: InMemoryRolesRepository
  let sut: FetchManyRolesByRecipientIdUseCase

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
          name: generateNameValueObject(),
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
      expect(result.value.pagination.page).toBe(1)
      expect(result.value.pagination.pageSize).toBe(5)
      expect(result.value.pagination.total).toBe(10)
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
      expect(result.value.pagination.total).toBe(2)
      expect(result.value.roles.map((r) => r.name.value)).toEqual(
        expect.arrayContaining(['Admin', 'Editor']),
      )
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
      expect(result.value.pagination.total).toBe(0)
    }
  })

  it('should return error for invalid pagination parameters', async () => {
    const result = await sut.execute({
      recipientId: 'some-id',
      page: 0,
      pageSize: 0,
    })

    expect(result.isLeft()).toBe(true)
  })
})
