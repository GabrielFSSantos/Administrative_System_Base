import { SupportedLocale } from '@/shared/value-objects/locale/locale.enum'

import { sessionCreatedEmailTemplate } from '../templates/session-created'

interface BuildSessionCreatedEmailParams {
  name: string
  date: string
  locale?: SupportedLocale
}

export function buildSessionCreatedEmail({
  name,
  date,
  locale = SupportedLocale.PT_BR,
}: BuildSessionCreatedEmailParams) {
  const template = sessionCreatedEmailTemplate[locale]

  return {
    subject: template.subject,
    title: template.title,
    body: template.body(name, date),
  }
}
