import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import * as request from "supertest";
import { disconnect } from "mongoose";
import { AppModule } from "../src/app.module";
import { CreateUserDto } from "../src/auth/dto/create-user.dto";
import { USER_NOT_FOUND_ERROR } from "../src/auth/auth.constans";
import { SignInDto } from "../src/auth/dto/signin.dto";
import { Statistic } from "../src/auth/dto/results.dto";

const testRegDelDto: CreateUserDto = {
  email: "test@test.com",
  name: "Test",
  password: "test123@",
  statistics: [],
};

const testLogInDto: SignInDto = {
  email: "testLogIn@test.com",
  password: "test123@",
};

const statDto: Statistic = {
  category: "theory",
  correct: 6,
  incorrect: 6,
};

describe("AppController (e2e)", () => {
  let app: INestApplication;
  let createdId: string;
  let token: string;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it("/users/signup (POST) - success", async () => {
    try {
      const { body } = await request(app.getHttpServer())
        .post("/users/signup")
        .send(testRegDelDto)
        .expect(201);

      createdId = body.user._id;
      token = body.token;
      return expect(createdId).toBeDefined();
    } catch (error) {
      console.log("error:", error);
    }
  });

  it("/users/signup (POST) - fail", () => {
    return request(app.getHttpServer())
      .post("/users/signup")
      .send({ ...testRegDelDto, name: "Te" })
      .expect(400);
  });

  it("/users/login (POST) - success", async () => {
    try {
      const { body } = await request(app.getHttpServer())
        .post("/users/login")
        .send(testLogInDto)
        .expect(200);

      return expect(body.token).toBeDefined();
    } catch (error) {
      console.log("error:", error);
    }
  });

  it("/users/login (POST) - fail", async () => {
    try {
      const { body } = await request(app.getHttpServer())
        .post("/users/login")
        .send({
          email: "email",
          password: testRegDelDto.password,
        })
        .expect(401);

      return expect(body.message).toBe(USER_NOT_FOUND_ERROR);
    } catch (error) {
      console.log("error:", error);
    }
  });

  it("/users/:id (PATCH) - success", async () => {
    try {
      const { body } = await request(app.getHttpServer())
        .patch(`/users/${createdId}`)
        .set("Authorization", `Bearer ${token}`)
        .send(statDto);

      return expect(body.statistics[0].category).toBe(statDto.category);
    } catch (error) {
      console.log("error:", error);
    }
  });

  it("/users/:id (DELETE) - success", async () => {
    try {
      return await request(app.getHttpServer())
        .delete(`/users/${createdId}`)
        .set("Authorization", `Bearer ${token}`)
        .expect(200);
    } catch (error) {
      console.log("error:", error);
    }
  });

  afterAll(() => {
    disconnect();
  });
});
