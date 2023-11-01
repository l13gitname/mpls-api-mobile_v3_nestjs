import { Test, TestingModule } from '@nestjs/testing';
import { FirstPartyApiController } from './first-party-api.controller';

describe('FirstPartyApiController', () => {
  let controller: FirstPartyApiController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FirstPartyApiController],
    }).compile();

    controller = module.get<FirstPartyApiController>(FirstPartyApiController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
