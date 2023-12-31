import { describe, it, expect, vi, beforeEach } from "vitest"
import { PostLoginUserController } from "./PostLoginUserController.js"
import { ZodError } from "zod"

describe("PostLoginUserController", () => {
  const email = "hola@hola.com"
  const password = "123456"
  const token = "myToken"
  let res
  let json
  let loginUser
  let postLoginUserController

  beforeEach(() => {
    json = vi.fn()
    res = {
      status: vi.fn(() => ({ json })),
    }
    loginUser = {
      execute: vi.fn(() => token),
    }
    postLoginUserController = new PostLoginUserController(loginUser)
  })

  it("invokes the use case", async () => {
    const req = {
      body: {
        email,
        password,
      },
    }

    await postLoginUserController.execute(req, res)

    expect(loginUser.execute).toHaveBeenCalled(email, password)
  })

  it("responds with status 200 when user is logged", async () => {
    const req = {
      body: {
        email,
        password,
      },
    }
    await postLoginUserController.execute(req, res)

    expect(res.status).toHaveBeenCalledWith(200)
  })

  it("responds with token", async () => {
    const req = {
      body: {
        email,
        password,
      },
    }

    await postLoginUserController.execute(req, res)
    expect(json).toHaveBeenCalledWith({ token })
  })

  it("throws a zod error if email is not defined", async () => {
    const req = {
      body: {
        password,
      },
    }

    const result = postLoginUserController.execute(req, res)
    await expect(result).rejects.toBeInstanceOf(ZodError)
  })

  it("throws a zod error if password is not defined", async () => {
    const req = {
      body: {
        email,
      },
    }

    const result = postLoginUserController.execute(req, res)
    await expect(result).rejects.toBeInstanceOf(ZodError)
  })

  it("throws and error if loginUser is undefined", async () => {
    expect(() => {
      new PostLoginUserController()
    }).toThrow()
  })
})
