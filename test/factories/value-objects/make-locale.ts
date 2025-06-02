import { Locale } from '@/shared/value-objects/locale/locale'
import { SupportedLocale } from '@/shared/value-objects/locale/locale.enum'

export function generateLocaleValueObject(value?: SupportedLocale): Locale {
  const localeOrError = Locale.create(value ?? SupportedLocale.PT_BR)

  if (localeOrError.isLeft()) {
    throw localeOrError.value
  }

  return localeOrError.value
}
