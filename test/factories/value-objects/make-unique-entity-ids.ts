import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { UniqueEntityIdList } from '@/shared/UniqueEntityIdList/unique-entity-id-list'

export function generateUniqueEntityIdValueObject(value?: string): UniqueEntityId {
  return new UniqueEntityId(value)
}

export function generateUniqueEntityIdList(count = 1): UniqueEntityIdList {
  const ids = Array.from({ length: count }, () => generateUniqueEntityIdValueObject())

  return new UniqueEntityIdList(ids)
}
