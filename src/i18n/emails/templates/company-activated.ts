import { SupportedLocale } from '@/shared/value-objects/locale/locale.enum'

export const companyActivatedEmailTemplate: Record<SupportedLocale, {
  subject: string
  title: string
  body: (name: string, date: string) => string
}> = {
  [SupportedLocale.PT_BR]: {
    subject: 'Sua empresa foi ativada',
    title: 'Parabéns!',
    body: (name, date) =>
      `Olá ${name}, sua empresa foi ativada com sucesso em ${date}. Agora você já pode acessar o sistema com todas as funcionalidades liberadas.`,
  },
  [SupportedLocale.EN_US]: {
    subject: 'Your company has been activated',
    title: 'Congratulations!',
    body: (name, date) =>
      `Hello ${name}, your company was successfully activated on ${date}. You can now access the system with all features enabled.`,
  },
}
