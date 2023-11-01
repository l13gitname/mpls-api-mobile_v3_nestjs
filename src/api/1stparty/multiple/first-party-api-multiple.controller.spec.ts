import { Test, TestingModule } from '@nestjs/testing';
import { FirstPartyApiMultipleController } from './first-party-api-multiple.controller';

describe('FirstPartyApiMultipleController', () => {
  let controller: FirstPartyApiMultipleController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FirstPartyApiMultipleController],
    }).compile();

    controller = module.get<FirstPartyApiMultipleController>(FirstPartyApiMultipleController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
