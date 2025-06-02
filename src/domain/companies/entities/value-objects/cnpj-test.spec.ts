import { CNPJ } from '@/domain/companies/entities/value-objects/cnpj'
import { InvalidCNPJError } from '@/domain/companies/entities/value-objects/errors/invalid-cnpj-error'

describe('CNPJValueObjectTest', () => {
  it('should create a valid CNPJ object', () => {
    const result = CNPJ.create('45.723.174/0001-10') // CNPJ fictício válido

    expect(result.isRight()).toBe(true)
    expect(result.value).toBeInstanceOf(CNPJ)
    expect(result.value.toString()).toBe('45723174000110')
  })

  it('should normalize formatted CNPJ string', () => {
    const result = CNPJ.create('45.723.174/0001-10')

    expect(result.isRight()).toBe(true)
    expect(result.value.toString()).toBe('45723174000110')
  })

  it('should return error for CNPJ with letters', () => {
    const result = CNPJ.create('ab.cd.efg/hijk-lm')

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(InvalidCNPJError)
  })

  it('should return error for CNPJ with less than 14 digits', () => {
    const result = CNPJ.create('1234567890123')

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(InvalidCNPJError)
  })

  it('should return error for CNPJ with all identical digits', () => {
    const result = CNPJ.create('11.111.111/1111-11')

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(InvalidCNPJError)
  })

  it('should return error for CNPJ with invalid check digits', () => {
    const result = CNPJ.create('45.723.174/0001-00')

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(InvalidCNPJError)
  })

  it('should compare CNPJ equality correctly', () => {
    const a = CNPJ.create('45.723.174/0001-10')
    const b = CNPJ.create('45723174000110')

    expect(a.isRight()).toBe(true)
    expect(b.isRight()).toBe(true)

    if (a.isRight() && b.isRight()) {
      expect(a.value.equals(b.value)).toBe(true)
    }
  })
})
