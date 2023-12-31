import express from "express"
import { UserRepositoryMongo } from "../UserRepository/UserRepositoryMongo.js"
import { IdGeneratorNode } from "../IdGenerator/IdGeneratorNode.js"
import { EmailSenderMock } from "../EmailSender/EmailSenderMock.js"
import { RegisterUser } from "../../application/RegisterUser.js"
import { PostUserController } from "./Controllers/PostUserController.js"
import { errorHandler } from "../Middlewares/errorHandler.js"
import { PostLoginUserController } from "./Controllers/PostLoginUserController.js"
import { LoginUser } from "../../application/LoginUser.js"
import { JsonWebTokenNode } from "../../domain/services/JsonWebTokenNode.js"

export class Server {
  constructor() {
    this.dependencies = this.createDependencies()

    this.app = express()
    this.app.use(express.json())
    this.app.post("/users/register", this.dependencies.postUserController.execute)
    this.app.post("/users/login", this.dependencies.postLoginUserController.execute)
    this.app.use(errorHandler)
  }

  createDependencies() {
    const userRepository = new UserRepositoryMongo()
    const idGenerator = new IdGeneratorNode()
    const emailSender = new EmailSenderMock()
    const jsonWebTokenManager = new JsonWebTokenNode()
    const registerUser = new RegisterUser(userRepository, idGenerator, emailSender)
    const loginUser = new LoginUser(userRepository, jsonWebTokenManager)
    const postUserController = new PostUserController(registerUser)
    const postLoginUserController = new PostLoginUserController(loginUser)

    return {
      userRepository,
      idGenerator,
      emailSender,
      registerUser,
      postUserController,
      postLoginUserController,
    }
  }

  async connect() {
    await this.dependencies.userRepository.connect()
  }

  async disconnect() {
    await this.dependencies.userRepository.disconnect()
  }

  async reset() {
    await this.dependencies.userRepository.reset()
  }

  listen() {
    const port = 3000
    this.app.listen(port, () => {
      console.log(`Server listening at http://localhost:${port}`)
    })
  }
}
