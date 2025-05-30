import { DomainError } from '@/core/errors/domain-error'

export class SendEmailError extends Error implements DomainError {
  constructor(public readonly recipientEmail: string, originalMessage?: string) {
    super(`Failed to send the email to ${recipientEmail}.${originalMessage ? ` Reason: ${originalMessage}` : ''}`)
  }
}
