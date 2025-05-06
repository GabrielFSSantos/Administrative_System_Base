import { left,right } from '@/core/either'
import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { 
  AuthenticateUserContract, 
  IAuthenticateUserUseCaseRequest, 
  IAuthenticateUserUseCaseResponse, 
} from '@/domain/users/use-cases/contracts/authenticate-user-contract'
import { WrongCredentialsError } from '@/domain/users/use-cases/errors/wrong-credentials-error'

export class FakeAuthenticateUserUseCase implements AuthenticateUserContract {
  public shouldFail: boolean = false
  public shouldBeInactive: boolean = false

  async execute(_params: IAuthenticateUserUseCaseRequest): 
  Promise<IAuthenticateUserUseCaseResponse> {
    if (this.shouldFail) {
      return left(new WrongCredentialsError())
    }

    if (this.shouldBeInactive) {
      return left(new NotAllowedError())
    }

    return right({
      userId: 'fake-user-id',
      accessToken: 'fake-token',
      expiresAt: new Date(Date.now() + 1000 * 60 * 60),
    })
  }
}
