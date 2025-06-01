
import { Injectable } from '@nestjs/common'

import { left, right } from '@/core/either'
import { EmailAddress } from '@/shared/value-objects/email-address'

import { Email } from '../entities/email'
import { ActionLink } from '../entities/value-objects/action-link'
import { Body } from '../entities/value-objects/body'
import { Subject } from '../entities/value-objects/subject'
import { Title } from '../entities/value-objects/title'
import {
  CreateEmailContract,
  ICreateEmailUseCaseRequest,
  ICreateEmailUseCaseResponse,
} from './contracts/create-email-contract'

@Injectable()
export class CreateEmailUseCase implements CreateEmailContract {
  async execute({
    to,
    from,
    subject,
    title,
    body,
    actionLink,
  }: ICreateEmailUseCaseRequest): Promise<ICreateEmailUseCaseResponse> {
    const toOrError = EmailAddress.create(to)

    if (toOrError.isLeft()) {
      return left(toOrError.value)
    }

    const fromOrError = EmailAddress.create(from)

    if (fromOrError.isLeft()) {
      return left(fromOrError.value)
    }

    const subjectOrError = Subject.create(subject)

    if (subjectOrError.isLeft()) {
      return left(subjectOrError.value)
    }

    const titleOrError = Title.create(title)

    if (titleOrError.isLeft()) {
      return left(titleOrError.value)
    }

    const bodyOrError = Body.create(body)

    if (bodyOrError.isLeft()) {
      return left(bodyOrError.value)
    }

    let actionLinkObject: ActionLink | null = null

    if (actionLink) {
      const actionLinkOrError = ActionLink.create(actionLink)

      if (actionLinkOrError.isLeft()) {
        return left(actionLinkOrError.value)
      }
      actionLinkObject = actionLinkOrError.value
    }

    const emailOrError = Email.create({
      to: toOrError.value,
      from: fromOrError.value,
      subject: subjectOrError.value,
      title: titleOrError.value,
      body: bodyOrError.value,
      actionLink: actionLinkObject,
    })

    if (emailOrError.isLeft()) {
      return left(emailOrError.value)
    }

    return right({ email: emailOrError.value })
  }
}
