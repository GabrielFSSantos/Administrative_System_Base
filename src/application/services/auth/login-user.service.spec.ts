import { FakeCreateSessionUseCase } from 'test/fakes/sessions/fake-create-session-use-case'
import { FakeAuthenticateUserUseCase } from 'test/fakes/users/fake-authenticate-user-use-case'

import { WrongCredentialsError } from '@/domain/users/use-cases/errors/wrong-credentials-error'

import { LoginUserService } from './login-user.service'

describe('LoginUserService', () => {
  let service: LoginUserService
  let authenticateUser: FakeAuthenticateUserUseCase 
  let createSession: FakeCreateSessionUseCase

  beforeEach(() => {
    authenticateUser = new FakeAuthenticateUserUseCase()
    createSession = new FakeCreateSessionUseCase()

    service = new LoginUserService(authenticateUser, createSession)
  })

  it('should return accessToken if authentication and session creation succeed', async () => {
    const result = await service.execute({
      email: 'user@test.com',
      password: '123456',
    })

    expect(result.isRight()).toBe(true)

    if (result.isRight()) {
      expect(result.value.accessToken).toBe('fake-token')
    }
  })

  it('should return error if authentication fails', async () => {
    authenticateUser.shouldFail = true

    const result = await service.execute({
      email: 'user@test.com',
      password: 'wrong',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(WrongCredentialsError)
  })

  it('should call createSession with correct parameters', async () => {
    const spy = vi.spyOn(createSession, 'execute')

    const result = await service.execute({
      email: 'user@test.com',
      password: '123456',
    })

    expect(result.isRight()).toBe(true)
    expect(spy).toHaveBeenCalledWith({
      recipientId: 'fake-user-id',
      accessToken: 'fake-token',
      expiresAt: expect.any(Date),
    })
  })
})
