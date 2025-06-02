import { SupportedLocale } from '@/shared/value-objects/locale/locale.enum'

import { memberActivatedEmailTemplate } from '../templates/member-activated'

interface BuildMemberActivatedEmailParams {
  name: string
  companyName: string
  date: string
  locale?: SupportedLocale
}

export function buildMemberActivatedEmail({
  name,
  companyName,
  date,
  locale = SupportedLocale.PT_BR,
}: BuildMemberActivatedEmailParams) {
  const template = memberActivatedEmailTemplate[locale]

  return {
    subject: template.subject,
    title: template.title,
    body: template.body(name, companyName, date),
  }
}
