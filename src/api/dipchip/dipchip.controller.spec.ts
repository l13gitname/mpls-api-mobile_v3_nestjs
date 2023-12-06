import { Test, TestingModule } from '@nestjs/testing';
import { DipchipController } from './dipchip.controller';

describe('DipchipController', () => {
  let controller: DipchipController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DipchipController],
    }).compile();

    controller = module.get<DipchipController>(DipchipController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
