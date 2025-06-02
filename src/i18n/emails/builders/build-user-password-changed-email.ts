import { SupportedLocale } from '@/shared/value-objects/locale/locale.enum'

import { userPasswordChangedEmailTemplate } from '../templates/user-password-changed-email-template'

interface BuildUserPasswordChangedEmailParams {
  name: string
  date: string
  locale?: SupportedLocale
}

export function buildUserPasswordChangedEmail({
  name,
  date,
  locale = SupportedLocale.PT_BR,
}: BuildUserPasswordChangedEmailParams) {
  const template = userPasswordChangedEmailTemplate[locale]

  return {
    subject: template.subject,
    title: template.title,
    body: template.body(name, date),
  }
}
