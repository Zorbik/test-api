import { getModelToken } from "@nestjs/mongoose";
import { Test, TestingModule } from "@nestjs/testing";
import { UsersService } from "./users.service";

describe("UsersService", () => {
  let service: UsersService;

  const exec = { exec: jest.fn() };
  const userRepositoryFactory = () => ({ findById: () => exec });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          useFactory: userRepositoryFactory,
          provide: getModelToken("User"),
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  // it("getById working", async () => {
  //   const id = "1";
  //   userRepositoryFactory().findById().exec.mockReturnValueOnce({ _id: id });
  //   const res = await service.getById(id);
  //   expect(res._id).toBe(id);
  // });
});
