import { CPF } from '@/domain/users/entities/value-objects/cpf'
import { InvalidCPFError } from '@/domain/users/entities/value-objects/errors/invalid-cpf-error'

describe('CPFValueObjectTest', () => {
  it('should create a valid CPF object', () => {
    const result = CPF.create('123.456.789-09') // CPF valido fictício

    expect(result.isRight()).toBe(true)
    expect(result.value).toBeInstanceOf(CPF)
    expect(result.value.toString()).toBe('12345678909')
  })

  it('should normalize formatted CPF string', () => {
    const result = CPF.create('123.456.789-09')

    expect(result.isRight()).toBe(true)
    expect(result.value.toString()).toBe('12345678909')
  })

  it('should return error for CPF with letters', () => {
    const result = CPF.create('abc.def.ghi-jk')

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(InvalidCPFError)
  })

  it('should return error for CPF with less than 11 digits', () => {
    const result = CPF.create('1234567890')

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(InvalidCPFError)
  })

  it('should return error for CPF with all identical digits', () => {
    const result = CPF.create('111.111.111-11')

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(InvalidCPFError)
  })

  it('should return error for CPF with invalid check digits', () => {
    const result = CPF.create('12345678900')

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(InvalidCPFError)
  })

  it('should compare CPF equality correctly', () => {
    const cpfA = CPF.create('123.456.789-09')
    const cpfB = CPF.create('12345678909')

    expect(cpfA.isRight()).toBe(true)
    expect(cpfB.isRight()).toBe(true)

    if (cpfA.isRight() && cpfB.isRight()) {
      expect(cpfA.value.equals(cpfB.value)).toBe(true)
    }
  })
})
