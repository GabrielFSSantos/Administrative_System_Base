import { InvalidNameError } from '@/shared/value-objects/errors/invalid-name-error'
import { Name } from '@/shared/value-objects/name'

describe('NameValueObjectTest', () => {
  it('should create a valid name object', () => {
    const result = Name.create('João Silva')

    expect(result.isRight()).toBe(true)
    expect(result.value).toBeInstanceOf(Name)
    expect(result.value.toString()).toBe('João Silva')
  })

  it('should normalize spaces and capitalization', () => {
    const result = Name.create('  maria   clara   de    souza  ')

    expect(result.isRight()).toBe(true)
    expect(result.value.toString()).toBe('Maria Clara De Souza')
  })

  it('should return error for name with special characters', () => {
    const result = Name.create('Jo@o!')

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(InvalidNameError)
  })

  it('should return error for name with numbers', () => {
    const result = Name.create('Ana123')

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(InvalidNameError)
  })

  it('should return error for name too short', () => {
    const result = Name.create('Jo')

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(InvalidNameError)
  })

  it('should return error for name too long', () => {
    const longName = 'a'.repeat(51)
    const result = Name.create(longName)

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(InvalidNameError)
  })

  it('should allow accented characters and multiple spaces', () => {
    const result = Name.create('José  da  Conceição')

    expect(result.isRight()).toBe(true)
    expect(result.value.toString()).toBe('José Da Conceição')
  })

  it('should compare name equality based on value', () => {
    const nameA = Name.create('Lucas Silva')
    const nameB = Name.create('  lucas    silva  ')

    expect(nameA.isRight()).toBe(true)
    expect(nameB.isRight()).toBe(true)

    if (nameA.isRight() && nameB.isRight()) {
      expect(nameA.value.equals(nameB.value)).toBe(true)
    }
  })
})
