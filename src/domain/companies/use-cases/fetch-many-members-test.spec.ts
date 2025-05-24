import { makeMember } from 'test/factories/companies/make-member'
import { makeUser } from 'test/factories/users/make-user'
import { generateNameValueObject } from 'test/factories/value-objects/make-name'
import { InMemoryMembersWithUsersRepository } from 'test/repositories/in-memory-members-with-users-repository'
import { vi } from 'vitest'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { User } from '@/domain/users/entities/user'
import { InvalidPaginationParamsError } from '@/shared/errors/invalid-pagination-params-error'

import { FetchManyMembersContract } from './contracts/fetch-many-members-contract'
import { FetchManyMembersUseCase } from './fetch-many-members-use-case'

describe('Fetch Many Members Use Case Test', () => {
  let membersRepository: InMemoryMembersWithUsersRepository
  let sut: FetchManyMembersContract

  beforeEach(() => {
    const userMap: Map<string, User> = new Map()

    membersRepository = new InMemoryMembersWithUsersRepository(userMap)
    sut = new FetchManyMembersUseCase(membersRepository)
  })

  it('should fetch up to pageSize members', async () => {
    const companyId = UniqueEntityId.create('company-1')

    for (let i = 0; i < 25; i++) {
      const user = await makeUser()
      const member = await makeMember({ recipientId: user.id, companyId })

      membersRepository['userMap'].set(user.id.toString(), user)
      await membersRepository.create(member)
    }

    const result = await sut.execute({ companyId: companyId.toString(), page: 1, pageSize: 20 })

    expect(result.isRight()).toBe(true)

    if (result.isRight()) {
      expect(result.value.members).toHaveLength(20)
      expect(result.value.pagination.total).toBe(25)
    }
  })

  it('should return correct page of members', async () => {
    const companyId = UniqueEntityId.create('company-2')

    for (let i = 0; i < 30; i++) {
      const user = await makeUser()
      const member = await makeMember({ recipientId: user.id, companyId })

      membersRepository['userMap'].set(user.id.toString(), user)
      await membersRepository.create(member)
    }

    const result = await sut.execute({ companyId: companyId.toString(), page: 2, pageSize: 10 })

    expect(result.isRight()).toBe(true)

    if (result.isRight()) {
      expect(result.value.members).toHaveLength(10)
      expect(result.value.pagination.page).toBe(2)
    }
  })

  it('should return empty list if no members exist', async () => {
    const result = await sut.execute({
      companyId: 'non-existent',
      page: 1,
      pageSize: 10,
    })

    expect(result.isRight()).toBe(true)

    if (result.isRight()) {
      expect(result.value.members).toHaveLength(0)
    }
  })

  it('should call repository with correct arguments', async () => {
    const spy = vi.spyOn(membersRepository, 'findMany')

    await sut.execute({ companyId: 'company-3', page: 3, pageSize: 15 })

    expect(spy).toHaveBeenCalledWith({
      companyId: 'company-3',
      page: 3,
      pageSize: 15,
      search: undefined,
    })
  })

  it('should return error when page is less than 1', async () => {
    const result = await sut.execute({ companyId: 'x', page: 0, pageSize: 10 })

    expect(result.isLeft()).toBe(true)

    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(InvalidPaginationParamsError)
    }
  })

  it('should return error when pageSize is less than 1', async () => {
    const result = await sut.execute({ companyId: 'x', page: 1, pageSize: 0 })

    expect(result.isLeft()).toBe(true)

    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(InvalidPaginationParamsError)
    }
  })

  it('should filter members based on search term (name)', async () => {
    const companyId = UniqueEntityId.create('company-4')

    const userA = await makeUser({ name: generateNameValueObject('Ana Clara') })
    const userB = await makeUser({ name: generateNameValueObject('João Silva') })

    const memberA = await makeMember({ companyId, recipientId: userA.id })
    const memberB = await makeMember({ companyId, recipientId: userB.id })

    membersRepository['userMap'].set(userA.id.toString(), userA)
    membersRepository['userMap'].set(userB.id.toString(), userB)

    await membersRepository.create(memberA)
    await membersRepository.create(memberB)

    const result = await sut.execute({
      companyId: companyId.toString(),
      page: 1,
      pageSize: 10,
      search: 'ana',
    })

    expect(result.isRight()).toBe(true)

    if (result.isRight()) {
      expect(result.value.members).toHaveLength(1)
      expect(result.value.members[0].recipientId).toEqual(memberA.recipientId)
    }
  })
})
