import { SupportedLocale } from '@/shared/value-objects/locale/locale.enum'

import { systemAdminActivatedEmailTemplate } from '../templates/system-admin-activated'

interface BuildSystemAdminActivatedEmailParams {
  name: string
  date: string
  locale?: SupportedLocale
}

export function buildSystemAdminActivatedEmail({
  name,
  date,
  locale = SupportedLocale.PT_BR,
}: BuildSystemAdminActivatedEmailParams) {
  const template = systemAdminActivatedEmailTemplate[locale]

  return {
    subject: template.subject,
    title: template.title,
    body: template.body(name, date),
  }
}
