import { EmailAddress } from '@/domain/users/entities/value-objects/email-address'

const domains = ['example.com', 'testmail.com', 'mailinator.com']

let counter = 0

export function generateValidEmail(): string {
  const domain = domains[counter % domains.length]
  const local = `user${Date.now()}${counter}`

  counter++

  return `${local}@${domain}`
}

export function generateEmailValueObject(): EmailAddress {
  return EmailAddress.create(generateValidEmail())
}