import { Injectable } from '@nestjs/common'

import { left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'

import { SessionsRepositoryContract } from '../repositories/contracts/sessions-repository-contract'
import { 
  GetLastSessionByRecipientIdContract,
  IGetLastSessionByRecipientIdRequest, 
  IGetLastSessionByRecipientIdResponse, 
} from './contracts/get-last-session-by-recipient-id-contract'

@Injectable()
export class GetLastSessionByRecipientIdUseCase 
implements GetLastSessionByRecipientIdContract {
  constructor(
    private readonly sessionsRepository: SessionsRepositoryContract,
  ) {}

  async execute({
    recipientId,
  }: IGetLastSessionByRecipientIdRequest): 
  Promise<IGetLastSessionByRecipientIdResponse> {
    const session = await this.sessionsRepository.findLastByRecipientId(recipientId)

    if (!session) {
      return left(new ResourceNotFoundError())
    }

    return right({
      session,
    })
  }
}
