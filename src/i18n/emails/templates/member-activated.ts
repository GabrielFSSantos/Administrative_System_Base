import { SupportedLocale } from '@/shared/value-objects/locale/locale.enum'

export const memberActivatedEmailTemplate: Record<
  SupportedLocale,
  {
    subject: string
    title: string
    body: (name: string, company: string, date: string) => string
  }
> = {
  [SupportedLocale.PT_BR]: {
    subject: 'Você foi ativado como membro de uma empresa',
    title: 'Acesso liberado',
    body: (name, company, date) =>
      `Olá ${name}, seu acesso como membro da empresa ${company} foi ativado em ${date}. Você já pode acessar o sistema normalmente.`,
  },
  [SupportedLocale.EN_US]: {
    subject: 'You have been activated as a company member',
    title: 'Access granted',
    body: (name, company, date) =>
      `Hello ${name}, your access as a member of the company ${company} was activated on ${date}. You can now access the system normally.`,
  },
}
