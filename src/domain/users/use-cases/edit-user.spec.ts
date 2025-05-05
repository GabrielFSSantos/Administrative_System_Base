import { makeUser } from 'test/factories/make-user'
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'

import { EditUserUseCase } from './edit-user'
import { UserAlreadyExistsError } from './errors/user-already-exists-error'

let inMemoryUsersRepository: InMemoryUsersRepository
let sut: EditUserUseCase

describe('Edit User', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()

    sut = new EditUserUseCase(inMemoryUsersRepository)
  })

  it('should be able to edit a user', async () => {
    const user = makeUser()
  
    await inMemoryUsersRepository.create(user)

    const result = await sut.execute({
      userId: user.id.toString(),
      email: 'email@teste.com.br',
      name: 'name teste',
      roleId: 'TESTE',
      isActive: false,
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryUsersRepository.items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          email: 'email@teste.com.br',
          name: 'name teste',
          roleId: new UniqueEntityId('TESTE'),
          isActive: null,
        }),
      ]),
    )
  })
  
  it('should update only the name and preserve other fields', async () => {
    const user = makeUser({
      email: 'email@teste.com.br',
      name: 'name teste',
    })
  
    await inMemoryUsersRepository.create(user)
  
    await sut.execute({
      userId: user.id.toString(),
      name: 'new name',
    })

    expect(inMemoryUsersRepository.items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          email: 'email@teste.com.br',
          name: 'new name',
        }),
      ]),
    )
  })

  it('should allow setting isActive to Date', async () => {
    const user = makeUser()
  
    await inMemoryUsersRepository.create(user)

    expect(inMemoryUsersRepository.items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          isActive: null,
        }),
      ]),
    )
  
    await sut.execute({
      userId: user.id.toString(),
      isActive: true,
    })
  
    expect(inMemoryUsersRepository.items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          isActive: expect.any(Date),
        }),
      ]),
    )
  })

  it('should update updatedAt timestamp on edit', async () => {
    const user = makeUser()
  
    await inMemoryUsersRepository.create(user)

    expect(inMemoryUsersRepository.items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          updatedAt: null,
        }),
      ]),
    )
  
    await sut.execute({
      userId: user.id.toString(),
      isActive: true,
    })
  
    expect(inMemoryUsersRepository.items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          updatedAt: expect.any(Date),
        }),
      ]),
    )
  })

  it('should call repository.save with updated user', async () => {
    const spy = vi.spyOn(inMemoryUsersRepository, 'save')
  
    const user = makeUser()
  
    await inMemoryUsersRepository.create(user)
  
    await sut.execute({
      userId: user.id.toString(),
      name: 'updated name',
    })
  
    expect(spy).toHaveBeenCalled()
  })

  it('should throw UserNotFoundError if user does not exist', async () => {
    const result = await sut.execute({userId: 'non-existing-id'})
  
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not allow to edit a user with an existing email', async () => {
    const user1 = makeUser({ email: 'email1@teste.com' })
    const user2 = makeUser({ email: 'email2@teste.com' })

    await inMemoryUsersRepository.create(user1)
    await inMemoryUsersRepository.create(user2)
    
    const result = await sut.execute({
      userId: user1.id.toString(),
      email: user2.email,
    })
    
    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(UserAlreadyExistsError)
  })
})
