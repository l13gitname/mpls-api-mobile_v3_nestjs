import { Test, TestingModule } from '@nestjs/testing';
import { ViewsignController } from './viewsign.controller';

describe('ViewsignController', () => {
  let controller: ViewsignController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ViewsignController],
    }).compile();

    controller = module.get<ViewsignController>(ViewsignController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
