import { Injectable } from '@nestjs/common'

import { left, right } from '@/core/either'
import { EmailAddress } from '@/shared/value-objects/email-address'

import { Email } from '../entities/email'
import { 
  CreateEmailContract, 
  ICreateEmailUseCaseRequest, 
  ICreateEmailUseCaseResponse, 
} from './contracts/create-email-contract'

@Injectable()
export class CreateEmailUseCase implements CreateEmailContract {
  async execute({
    to,
    subject,
    title,
    body,
    actionLink,
  }: ICreateEmailUseCaseRequest): Promise<ICreateEmailUseCaseResponse> {
    const emailAddressOrError = EmailAddress.create(to)

    if (emailAddressOrError.isLeft()) {
      return left(emailAddressOrError.value)
    }

    const emailOrError = Email.create({
      to: emailAddressOrError.value,
      subject,
      title,
      body,
      actionLink,
    })

    if (emailOrError.isLeft()) {
      return left(emailOrError.value)
    }

    return right({ email: emailOrError.value })
  }
}
