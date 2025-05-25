import { EmailAddress } from '@/shared/value-objects/email-address'

const domains = ['example.com', 'testmail.com', 'mailinator.com']

let counter = 0

export function generateValidEmail(): string {
  const domain = domains[counter % domains.length]
  const local = `user${Date.now()}${counter}`

  counter++

  return `${local}@${domain}`
}

export function generateEmailValueObject(value?: string): EmailAddress {
  const emailObject = EmailAddress.create(value ?? generateValidEmail())
    
  if(emailObject.isLeft()) {
    throw emailObject.value
  }
  
  return emailObject.value
}