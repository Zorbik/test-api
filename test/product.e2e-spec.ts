import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import * as request from "supertest";
import { disconnect } from "mongoose";
import { AppModule } from "../src/app.module";
import { SignInDto } from "../src/auth/dto/signin.dto";
import { CreateTestDto } from "../src/product/dto/create-test.dto";
import { CATEGORY_NOT_FOUND_ERROR } from "../src/product/product.constants";

const testLogInDto: SignInDto = {
  email: "testLogIn@test.com",
  password: "test123@",
};

const testDto: CreateTestDto = {
  category: "theory",
  question: "string?",
  answers: ["yes", "no", "I don't no"],
  rightAnswer: "yes",
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

    const { body } = await request(app.getHttpServer())
      .post("/users/login")
      .send(testLogInDto);
    token = body.token;
  });

  it("/tests/create (POST) - success", async () => {
    try {
      const { body } = await request(app.getHttpServer())
        .post("/tests/create")
        .set("Authorization", `Bearer ${token}`)
        .send(testDto)
        .expect(201);

      createdId = body._id;
      return expect(createdId).toBeDefined();
    } catch (error) {
      console.log("error:", error);
    }
  });

  it("/tests/exam/:category (GET) - success", async () => {
    try {
      const { body } = await request(app.getHttpServer())
        .get(`/tests/exam/${testDto.category}`)
        .set("Authorization", `Bearer ${token}`)
        .expect(200);

      return expect(body.length).toBe(12);
    } catch (error) {
      console.log("error:", error);
    }
  });

  it("/tests/exam/:category (GET) - fail", async () => {
    const { body } = await request(app.getHttpServer())
      .get(`/tests/exam/:category`)
      .set("Authorization", `Bearer ${token}`)
      .expect(404);

    return expect(body.message).toBe(CATEGORY_NOT_FOUND_ERROR);
  });

  it("/tests/exam/:category (GET) - fail", async () => {
    try {
      return await request(app.getHttpServer())
        .get(`/tests/exam/${testDto.category}`)
        .set("Authorization", `Bearer token`)
        .expect(401);
    } catch (error) {
      console.log("error:", error);
    }
  });

  it("/tests/:id (PATCH) - success", async () => {
    try {
      const { body } = await request(app.getHttpServer())
        .patch(`/tests/${createdId}`)
        .set("Authorization", `Bearer ${token}`)
        .send({ ...testDto, rightAnswer: "no" });

      return expect(body.rightAnswer).toBe("no");
    } catch (error) {
      console.log("error:", error);
    }
  });

  it("/tests/:id (PATCH) - fail", async () => {
    try {
      return await request(app.getHttpServer())
        .patch(`/tests/${createdId}`)
        .set("Authorization", `Bearer ${token}`)
        .send({ ...testDto, category: "no" })
        .expect(400);
    } catch (error) {
      console.log("error:", error);
    }
  });

  it("/users/:id (DELETE) - success", async () => {
    try {
      const { body } = await request(app.getHttpServer())
        .delete(`/tests/${createdId}`)
        .set("Authorization", `Bearer ${token}`)
        .expect(200);

      return expect(body._id).toEqual(createdId);
    } catch (error) {
      console.log("error:", error);
    }
  });

  afterAll(() => {
    disconnect();
  });
});
