import { InMemoryRolesRepository } from 'test/repositories/in-memory-roles-repository'

import { CreateRoleContract } from '@/domain/roles/use-cases/contracts/create-role-contract'
import { CreateRoleUseCase } from '@/domain/roles/use-cases/create-role-use-case'
import { InvalidPermissionError } from '@/domain/roles/use-cases/errors/invalid-permission-error'
import { Permissions } from '@/shared/permissions'

describe('Create Role Test', () => {
  let inMemoryRolesRepository: InMemoryRolesRepository
  let sut: CreateRoleContract

  beforeEach(() => {
    inMemoryRolesRepository = new InMemoryRolesRepository()
    sut = new CreateRoleUseCase(inMemoryRolesRepository)
  })

  it('should be able to create a role', async () => {
    const result = await sut.execute({
      name: 'Manager',
      permissionValues: [Permissions.USERS.CREATE, Permissions.SESSIONS.CREATE],
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryRolesRepository.items.length).toBe(1)
    expect(inMemoryRolesRepository.items[0].name).toBe('Manager')
  })

  it('should not create role with invalid permissions', async () => {
    const result = await sut.execute({
      name: 'Invalid Role',
      permissionValues: ['invalid_permission'],
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(InvalidPermissionError)
  })

  it('should normalize and store permissions correctly', async () => {
    await sut.execute({
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
      name: 'Session Admin',
      permissionValues,
    })

    const stored = inMemoryRolesRepository.items[0]

    expect(stored.permissionValues).toEqual(expect.arrayContaining(permissionValues))
  })
})
