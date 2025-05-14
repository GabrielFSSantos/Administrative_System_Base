import { Injectable } from '@nestjs/common'

import { right } from '@/core/either'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'

import { Session } from '../entities/session'
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

    const session = Session.create({
      recipientId: new UniqueEntityId(recipientId),
      accessToken,
      expiresAt,
    })

    await this.sessionsRepository.create(session)

    return right({
      session, 
    })
  }
}
