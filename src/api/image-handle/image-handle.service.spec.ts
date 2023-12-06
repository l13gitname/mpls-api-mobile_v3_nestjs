import { Test, TestingModule } from '@nestjs/testing';
import { ImageHandleService } from './image-handle.service';

describe('ImageHandleService', () => {
  let service: ImageHandleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ImageHandleService],
    }).compile();

    service = module.get<ImageHandleService>(ImageHandleService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
