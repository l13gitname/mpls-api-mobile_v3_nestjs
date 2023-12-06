import { Test, TestingModule } from '@nestjs/testing';
import { ImageHandleController } from './image-handle.controller';

describe('ImageHandleController', () => {
  let controller: ImageHandleController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ImageHandleController],
    }).compile();

    controller = module.get<ImageHandleController>(ImageHandleController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
