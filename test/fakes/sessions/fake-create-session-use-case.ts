
import { left,right } from '@/core/either'
import { ICreateSessionUseCase, 
  ICreateSessionUseCaseRequest, 
  ICreateSessionUseCaseResponse, 
} from '@/domain/sessions/use-cases/contracts/create-session.interface'
import { SessionExpiredError } from '@/domain/sessions/use-cases/errors/session-expired-error'
export class FakeCreateSessionUseCase implements ICreateSessionUseCase {
  public shouldFail: boolean = false
   
  async execute(_params: ICreateSessionUseCaseRequest): 
  Promise<ICreateSessionUseCaseResponse> {
    if (this.shouldFail) {
      return left(new SessionExpiredError())
    }

    return right(null)
  }
}
