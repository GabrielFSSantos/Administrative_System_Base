import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { WatchedList } from '@/core/entities/watched-list'

export class UniqueEntityIdList extends WatchedList<UniqueEntityId> {
  public compareItems(a: UniqueEntityId, b: UniqueEntityId): boolean {
    return a.equals(b)
  }

  public has(uniqueEntityId: UniqueEntityId): boolean {
    return this.getItems().some((p) => p.equals(uniqueEntityId))
  }
}
