import { Injectable } from '@nestjs/common'

import { left, right } from '@/core/either'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'

import { Session } from '../entities/session'
import { AccessToken } from '../entities/value-objects/access-token'
import { SessionsRepositoryContract } from '../repositories/contracts/sessions-repository-contract'
import { CreateSessionContract, 
  ICreateSessionUseCaseRequest, 
  ICreateSessionUseCaseResponse, 
} from './contracts/create-session-contract'

@Injectable()
export class CreateSessionUseCase implements CreateSessionContract {
  constructor(
    private sessionsRepository: SessionsRepositoryContract,
  ) {}

  async execute({
    recipientId,
    accessToken,
    expiresAt,
  }: ICreateSessionUseCaseRequest): Promise<ICreateSessionUseCaseResponse> {

    const accessTokenObject = AccessToken.create(accessToken)
    
    if(accessTokenObject.isLeft()) {
      return left(accessTokenObject.value)
    }

    const session = Session.create({
      recipientId: UniqueEntityId.create(recipientId),
      accessToken: accessTokenObject.value,
      expiresAt,
    })

    if(session.isLeft()) {
      return left(session.value)
    }

    await this.sessionsRepository.create(session.value)

    return right({
      session: session.value, 
    })
  }
}
