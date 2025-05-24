import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { UniqueEntityIdList } from '@/shared/UniqueEntityIdList/unique-entity-id-list'

export function generateUniqueEntityIdListFromStrings(
  ids: string[] = [],
): UniqueEntityIdList {
  const uniqueEntityIds = ids.map((id) => new UniqueEntityId(id))

  return new UniqueEntityIdList(uniqueEntityIds)
}
