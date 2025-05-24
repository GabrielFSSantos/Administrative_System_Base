import { vi } from 'vitest'

import { left, right } from '@/core/either'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { ActivationStatus } from '@/shared/ActivationStatus/value-objects/activation-status'
import { AlreadyActivatedError } from '@/shared/ActivationStatus/value-objects/errors/already-activated-error'
import { AlreadyDeactivatedError } from '@/shared/ActivationStatus/value-objects/errors/already-deactivated-error'
import { ResourceNotFoundError } from '@/shared/errors/resource-not-found-error'

import { ActivatableEntity,ActivatableRepository } from '../repositories/contracts/activatable-repository-contract'
import { SetActivationStatusUseCase } from './set-activation-status-use-case'

class InMemoryActivatableRepository<T extends ActivatableEntity> implements ActivatableRepository<T> {
  public items: T[] = []

  async findById(id: string): Promise<T | null> {
    return this.items.find((item) => item.id.toString() === id) ?? null
  }

  async save(entity: T): Promise<void> {
    const index = this.items.findIndex((item) => item.id.equals(entity.id))

    if (index >= 0) {
      this.items[index] = entity
    }
  }
}

function makeFakeEntity<T extends ActivatableEntity>(
  entityFactory: (props?: Partial<T>, id?: UniqueEntityId) => T,
  active = false,
): T {
  return entityFactory({
    activationStatus: active ? ActivationStatus.activated() : ActivationStatus.deactivated(),
  } as Partial<T>)
}

describe('Set Activation Status Use Case', () => {
  let repository: InMemoryActivatableRepository<ActivatableEntity>
  let sut: SetActivationStatusUseCase<ActivatableEntity>

  const entityFactory = (props: Partial<ActivatableEntity> = {}, id?: UniqueEntityId): ActivatableEntity => {
    const baseId = id ?? new UniqueEntityId()

    return {
      id: baseId,
      activationStatus: props.activationStatus ?? ActivationStatus.deactivated(),
      isActivated() {
        return this.activationStatus.isActive()
      },
      activate() {
        if (this.isActivated()) {
          return left(new AlreadyActivatedError())
        }
        this.activationStatus = ActivationStatus.activated()

        return right(null)
      },
      deactivate() {
        if (!this.isActivated()) {
          return left(new AlreadyDeactivatedError())
        }
        this.activationStatus = ActivationStatus.deactivated()

        return right(null)
      },
    }
  }

  beforeEach(() => {
    repository = new InMemoryActivatableRepository()
    sut = new SetActivationStatusUseCase(repository)
  })

  it('should activate a deactivated entity', async () => {
    const entity = makeFakeEntity(entityFactory, false)

    repository.items.push(entity)

    const result = await sut.execute({
      entityId: entity.id.toString(),
      activationStatus: true,
    })

    expect(result.isRight()).toBe(true)
    const updated = await repository.findById(entity.id.toString())

    expect(updated?.isActivated()).toBe(true)
  })

  it('should deactivate an active entity', async () => {
    const entity = makeFakeEntity(entityFactory, true)

    repository.items.push(entity)

    const result = await sut.execute({
      entityId: entity.id.toString(),
      activationStatus: false,
    })

    expect(result.isRight()).toBe(true)
    const updated = await repository.findById(entity.id.toString())

    expect(updated?.isActivated()).toBe(false)
  })

  it('should return ResourceNotFoundError if entity does not exist', async () => {
    const result = await sut.execute({
      entityId: 'non-existent-id',
      activationStatus: true,
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })

  it('should return AlreadyActivatedError if entity is already active', async () => {
    const entity = makeFakeEntity(entityFactory, true)

    repository.items.push(entity)

    const result = await sut.execute({
      entityId: entity.id.toString(),
      activationStatus: true,
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(AlreadyActivatedError)
  })

  it('should return AlreadyDeactivatedError if entity is already inactive', async () => {
    const entity = makeFakeEntity(entityFactory, false)

    repository.items.push(entity)

    const result = await sut.execute({
      entityId: entity.id.toString(),
      activationStatus: false,
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(AlreadyDeactivatedError)
  })

  it('should call repository.save when activation is changed', async () => {
    const entity = makeFakeEntity(entityFactory, false)

    repository.items.push(entity)

    const spy = vi.spyOn(repository, 'save')

    await sut.execute({
      entityId: entity.id.toString(),
      activationStatus: true,
    })

    expect(spy).toHaveBeenCalledWith(expect.objectContaining({ id: entity.id }))
  })
})
