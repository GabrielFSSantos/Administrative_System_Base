import { describe, expect,it } from 'vitest'

import { ValueObject } from './value-object'

class TestVO extends ValueObject<{ value: string }> {
  static create(value: string) {
    return new TestVO({ value })
  }
}

describe('ValueObject', () => {
  it('should return true for two VOs with same props', () => {
    const vo1 = TestVO.create('abc')
    const vo2 = TestVO.create('abc')

    expect(vo1.equals(vo2)).toBe(true)
  })

  it('should return false for two VOs with different props', () => {
    const vo1 = TestVO.create('abc')
    const vo2 = TestVO.create('xyz')

    expect(vo1.equals(vo2)).toBe(false)
  })

  it('should return false when compared with null', () => {
    const vo = TestVO.create('abc')
    const invalid = null as unknown as ValueObject<unknown>

    expect(vo.equals(invalid)).toBe(false)
  })

  it('should return false when compared with undefined', () => {
    const vo = TestVO.create('abc')
    const invalid = undefined as any as ValueObject<any>

    expect(vo.equals(invalid)).toBe(false)
  })
})
