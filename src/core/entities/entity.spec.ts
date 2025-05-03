import { describe, expect,it } from 'vitest'

import { Entity } from './entity'
import { UniqueEntityId } from './unique-entity-id'

interface TestProps {
  value: string
}

class TestEntity extends Entity<TestProps> {
  static create(value: string, id?: UniqueEntityId) {
    return new TestEntity({ value }, id)
  }

  get value() {
    return this.props.value
  }
}

describe('Entity', () => {
  it('should return true when comparing the same instance', () => {
    const entity = TestEntity.create('test')

    expect(entity.equals(entity)).toBe(true)
  })

  it('should return true when entities have the same ID', () => {
    const id = new UniqueEntityId()

    const entity1 = TestEntity.create('one', id)
    const entity2 = TestEntity.create('two', id) // mesmo ID, props diferentes

    expect(entity1.equals(entity2)).toBe(true)
  })

  it('should return false when entities have different IDs', () => {
    const entity1 = TestEntity.create('one')
    const entity2 = TestEntity.create('two')

    expect(entity1.equals(entity2)).toBe(false)
  })

  it('should return false when compared with null or undefined', () => {
    const entity = TestEntity.create('value')

    const nullEntity = null as unknown as TestEntity
    const undefinedEntity = undefined as unknown as TestEntity

    expect(entity.equals(nullEntity)).toBe(false)
    expect(entity.equals(undefinedEntity)).toBe(false)
  })
})
