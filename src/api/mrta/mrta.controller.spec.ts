import { Test, TestingModule } from '@nestjs/testing';
import { MrtaController } from './mrta.controller';

describe('MrtaController', () => {
  let controller: MrtaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MrtaController],
    }).compile();

    controller = module.get<MrtaController>(MrtaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
