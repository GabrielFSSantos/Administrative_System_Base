import { makeUser } from 'test/factories/make-user'
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository'

import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'

import { AlreadyActivatedError } from './errors/already-activated-error'
import { AlreadyDeactivatedError } from './errors/already-deactivated-error'
import { SetUserActivationStatusUseCase } from './set-user-activation-status'

let inMemoryUsersRepository: InMemoryUsersRepository
let sut: SetUserActivationStatusUseCase

describe('Set User Activation Status', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()

    sut = new SetUserActivationStatusUseCase(
      inMemoryUsersRepository, 
    )
  })

  it('should be able to set user activation status', async () => {    
    const user = makeUser()
  
    await inMemoryUsersRepository.create(user)

    const result = await sut.execute({
      userId: user.id.toString(),
      isActive: true,
    })

    expect(result.isRight()).toBe(true)
  })

  it('should return ResourceNotFoundError if user does not exist', async () => {
    const result = await sut.execute({
      userId: 'non-existent-id',
      isActive: true,
    })
  
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })

  it('should return AlreadyActivatedError if user is already active', async () => {
    const user = makeUser({ isActive: new Date(Date.now() - 1000) })
  
    await inMemoryUsersRepository.create(user)

    user.activate()

    await inMemoryUsersRepository.save(user)
  
    const result = await sut.execute({
      userId: user.id.toString(),
      isActive: true,
    })
  
    expect(result.value).toBeInstanceOf(AlreadyActivatedError)
  })

  it('should return AlreadyDeactivatedError if user is already inactive', async () => {
    const user = makeUser() 
  
    await inMemoryUsersRepository.create(user)
  
    const result = await sut.execute({
      userId: user.id.toString(),
      isActive: false, 
    })
  
    expect(result.value).toBeInstanceOf(AlreadyDeactivatedError)
  })

  it('should update user isActive to a Date when activated', async () => {
    const user = makeUser({ isActive: null })
  
    await inMemoryUsersRepository.create(user)
  
    await sut.execute({
      userId: user.id.toString(),
      isActive: true,
    })
  
    const updatedUser = inMemoryUsersRepository.items.find((u) => u.id.equals(user.id))

    expect(updatedUser?.isActive).toBeInstanceOf(Date)
  })

  it('should update user isActive to null when deactivated', async () => {
    const user = makeUser({ isActive: new Date() })
  
    await inMemoryUsersRepository.create(user)
  
    await sut.execute({
      userId: user.id.toString(),
      isActive: false,
    })
  
    const updatedUser = inMemoryUsersRepository.items.find((u) => u.id.equals(user.id))

    expect(updatedUser?.isActive).toBeNull()
  })

  it('should call repository.save with updated user', async () => {
    const user = makeUser({ isActive: null })

    await inMemoryUsersRepository.create(user)
  
    const spy = vi.spyOn(inMemoryUsersRepository, 'save')
  
    await sut.execute({
      userId: user.id.toString(),
      isActive: true,
    })
  
    expect(spy).toHaveBeenCalled()
  })

})
