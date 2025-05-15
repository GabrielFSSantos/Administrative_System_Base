import { InMemoryRolesRepository } from 'test/repositories/in-memory-roles-repository'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { CreateRoleContract } from '@/domain/roles/use-cases/contracts/create-role-contract'
import { CreateRoleUseCase } from '@/domain/roles/use-cases/create-role-use-case'
import { InvalidPermissionError } from '@/domain/roles/use-cases/errors/invalid-permission-error'
import { Permissions } from '@/shared/permissions'
import { InvalidNameError } from '@/shared/value-objects/errors/invalid-name-error'

describe('Create Role Test', () => {
  let inMemoryRolesRepository: InMemoryRolesRepository
  let sut: CreateRoleContract

  beforeEach(() => {
    inMemoryRolesRepository = new InMemoryRolesRepository()
    sut = new CreateRoleUseCase(inMemoryRolesRepository)
  })

  it('should be able to create a role', async () => {
    const result = await sut.execute({
      recipientId: new UniqueEntityId('company-1').toString(),
      name: 'Manager',
      permissionValues: [Permissions.USERS.CREATE, Permissions.SESSIONS.CREATE],
    })

    expect(result.isRight()).toBe(true)

    if (result.isRight()) {
      const role = result.value.role

      expect(role.name.value).toBe('Manager')
      expect(role.recipientId.toString()).toBe('company-1')
      expect(role.permissionValues).toEqual(
        expect.arrayContaining([Permissions.USERS.CREATE, Permissions.SESSIONS.CREATE]),
      )
    }
  })

  it('should return error if permissions are invalid', async () => {
    const result = await sut.execute({
      recipientId: 'company-1',
      name: 'Invalid Role',
      permissionValues: ['invalid_permission'],
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(InvalidPermissionError)
  })

  it('should normalize and store permissions correctly', async () => {
    await sut.execute({
      recipientId: 'company-1',
      name: 'Editor',
      permissionValues: [Permissions.USERS.EDIT, Permissions.USERS.VIEW],
    })

    const role = inMemoryRolesRepository.items[0]

    expect(role.permissionValues).toContain('edit_user')
    expect(role.permissionValues).toContain('view_user')
  })

  it('should persist the exact permission values passed', async () => {
    const permissionValues = [Permissions.SESSIONS.CREATE, Permissions.SESSIONS.REVOKE]

    await sut.execute({
      recipientId: 'company-1',
      name: 'Session Admin',
      permissionValues,
    })

    const stored = inMemoryRolesRepository.items[0]

    expect(stored.permissionValues).toEqual(expect.arrayContaining(permissionValues))
  })

  it('should return error if name is invalid', async () => {
    const result = await sut.execute({
      recipientId: 'company-1',
      name: '  ', // nome inválido
      permissionValues: [Permissions.USERS.CREATE],
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(InvalidNameError)
  })
})
