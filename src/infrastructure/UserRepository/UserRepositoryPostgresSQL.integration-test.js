import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest"
import { UserRepositoryPostgresSQL } from "./UserRepositoryPostgresSQL"
import { User } from "../../domain/models/User.js"

describe("UserRepositoryPostgresSQL", () => {
  let userRepository

  beforeAll(async () => {
    userRepository = new UserRepositoryPostgresSQL()
    await userRepository.connect()
  })

  beforeEach(async () => {
    await userRepository.reset()
  })

  afterAll(async () => {
    await userRepository.disconnect()
  })

  it("saves a user in the database", async () => {
    const id = "00000000-0000-0000-0000-000000000000"
    const name = "John Doe"
    const email = "john@email.com"
    const age = 18
    const password = "password"
    const user = User.create(id, name, email, password, age)
    console.log(user)

    await userRepository.save(user)

    const savedUser = await userRepository.findById(id)
    expect(savedUser).toEqual(user)
  })

  it("findById returns null if user not found", async () => {
    const id = "00000000-0000-0000-0000-000000000000"

    const savedUser = await userRepository.findById(id)

    expect(savedUser).toEqual(null)
  })

  it("existsByEmail returns true if user is found", async () => {
    const id = "00000000-0000-0000-0000-000000000000"
    const name = "John Doe"
    const email = "john@email.com"
    const age = 18
    const password = "password"
    const user = User.create(id, name, email, password, age)
    await userRepository.save(user)

    const existsUser = await userRepository.existsByEmail(email)

    expect(existsUser).toBe(true)
  })

  it("existsByEmail returns false if user is not found", async () => {
    const email = "john@email.com"

    const existsUser = await userRepository.existsByEmail(email)

    expect(existsUser).toBe(false)
  })
})