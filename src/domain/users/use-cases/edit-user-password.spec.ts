import { FakeHasher } from 'test/cryptography/fake-hasher'
import { makeUser } from 'test/factories/make-user'
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository'

import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { WrongCredentialsError } from '@/core/errors/wrong-credentials-error'

import { EditUserPasswordUseCase } from './edit-user-password'
import { SamePasswordError } from './errors/same-password-error'

let inMemoryUsersRepository: InMemoryUsersRepository
let fakeHasher: FakeHasher
let sut: EditUserPasswordUseCase

describe('Edit User Password', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    fakeHasher = new FakeHasher()

    sut = new EditUserPasswordUseCase(
      inMemoryUsersRepository, 
      fakeHasher,
      fakeHasher,
    )
  })

  it('should be able to edit user password', async () => {
    const hashedPassword = await fakeHasher.generate('123456')
    
    const user = makeUser({
      password: hashedPassword,
    })
  
    await inMemoryUsersRepository.create(user)

    const result = await sut.execute({
      userId: user.id.toString(),
      password: '123456',
      newPassword: '654321',
    })

    expect(result.isRight()).toBe(true)
  })

  it('should return error if user does not exist', async () => {
    const result = await sut.execute({
      userId: 'non-existing-id',
      password: '123456',
      newPassword: '654321',
    })
  
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })

  it('should return error if current password is incorrect', async () => {
    const hashedPassword = await fakeHasher.generate('123456')
  
    const user = makeUser({ password: hashedPassword })

    await inMemoryUsersRepository.create(user)
  
    const result = await sut.execute({
      userId: user.id.toString(),
      password: 'wrong-password',
      newPassword: '654321',
    })
  
    expect(result.value).toBeInstanceOf(WrongCredentialsError)
  })

  it('should return error if new password is the same as current', async () => {
    const hashedPassword = await fakeHasher.generate('123456')
  
    const user = makeUser({ password: hashedPassword })

    await inMemoryUsersRepository.create(user)
  
    const result = await sut.execute({
      userId: user.id.toString(),
      password: '123456',
      newPassword: '123456',
    })
  
    expect(result.value).toBeInstanceOf(SamePasswordError)
  })

  it('should update user password with new hashed value', async () => {
    const originalPassword = '123456'
    const newPassword = '654321'
    const hashedPassword = await fakeHasher.generate(originalPassword)
  
    const user = makeUser({ password: hashedPassword })

    await inMemoryUsersRepository.create(user)
  
    await sut.execute({
      userId: user.id.toString(),
      password: originalPassword,
      newPassword,
    })
  
    const updatedUser = inMemoryUsersRepository.items.find((u) => u.id.equals(user.id))

    expect(updatedUser?.password).toBe(await fakeHasher.generate(newPassword))
  })

  it('should call repository.save with updated user', async () => {
    const spy = vi.spyOn(inMemoryUsersRepository, 'save')
  
    const hashedPassword = await fakeHasher.generate('123456')
    const user = makeUser({ password: hashedPassword })

    await inMemoryUsersRepository.create(user)
  
    await sut.execute({
      userId: user.id.toString(),
      password: '123456',
      newPassword: '654321',
    })
  
    expect(spy).toHaveBeenCalled()
  })

})
