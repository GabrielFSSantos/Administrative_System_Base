import { generateNameValueObject } from 'test/factories/value-objects/make-name'
import { generatePermissionList } from 'test/factories/value-objects/make-permissions'
import { InMemoryRolesRepository } from 'test/repositories/in-memory-roles-repository'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Role } from '@/domain/roles/entities/role'
import { GetRoleUseCase } from '@/domain/roles/use-cases/get-role-use-case'
import { ResourceNotFoundError } from '@/shared/errors/resource-not-found-error'

import { GetRoleContract } from './contracts/get-role-contract'

describe('Get Role Test', () => {
  let inMemoryRolesRepository: InMemoryRolesRepository
  let sut: GetRoleContract

  beforeEach(() => {
    inMemoryRolesRepository = new InMemoryRolesRepository()
    sut = new GetRoleUseCase(inMemoryRolesRepository)
  })

  it('should be able to get an existing role by ID', async () => {
    const recipientId = new UniqueEntityId('company-1')

    const role = Role.create({
      recipientId,
      name: generateNameValueObject('Viewer'),
      permissions: generatePermissionList(2), 
    })

    await inMemoryRolesRepository.create(role)

    const result = await sut.execute({ roleId: role.id.toString() })

    expect(result.isRight()).toBe(true)

    if (result.isRight()) {
      const fetchedRole = result.value.role

      expect(fetchedRole.name.value).toBe('Viewer')
      expect(fetchedRole.permissionValues.length).toBeGreaterThanOrEqual(1)
      expect(fetchedRole.recipientId.toString()).toBe(recipientId.toString())
    }
  })

  it('should return error if role does not exist', async () => {
    const invalidId = new UniqueEntityId().toString()

    const result = await sut.execute({ roleId: invalidId })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
