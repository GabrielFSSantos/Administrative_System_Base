import { SupportedLocale } from '@/shared/value-objects/locale/locale.enum'

import { companyActivatedEmailTemplate } from '../templates/company-activated'

interface BuildCompanyActivatedEmailParams {
  name: string
  date: string
  locale?: SupportedLocale
}

export function buildCompanyActivatedEmail({
  name,
  date,
  locale = SupportedLocale.PT_BR,
}: BuildCompanyActivatedEmailParams) {
  const template = companyActivatedEmailTemplate[locale]

  return {
    subject: template.subject,
    title: template.title,
    body: template.body(name, date),
  }
}
