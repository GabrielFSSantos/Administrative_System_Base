import { Injectable } from '@nestjs/common'

import { left, right } from '@/core/either'

import { EmailServiceContract } from '../services/contracts/email-service-contract'
import {
  ISendEmailUseCaseRequest,
  ISendEmailUseCaseResponse,
  SendEmailContract,
} from './contracts/send-email-contract'

@Injectable()
export class SendEmailUseCase implements SendEmailContract {
  constructor(private readonly emailService: EmailServiceContract) {}

  async execute({ email }: ISendEmailUseCaseRequest): Promise<ISendEmailUseCaseResponse> {
    const result = await this.emailService.send(email)

    if (result.isLeft()) {
      return left(result.value)
    }

    email.markAsSent()

    return right({ email })
  }
}
