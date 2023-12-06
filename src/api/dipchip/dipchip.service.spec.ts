import { Test, TestingModule } from '@nestjs/testing';
import { DipchipService } from './dipchip.service';

describe('DipchipService', () => {
  let service: DipchipService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DipchipService],
    }).compile();

    service = module.get<DipchipService>(DipchipService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
