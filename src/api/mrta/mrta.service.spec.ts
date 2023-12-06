import { Test, TestingModule } from '@nestjs/testing';
import { MrtaService } from './mrta.service';

describe('MrtaService', () => {
  let service: MrtaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MrtaService],
    }).compile();

    service = module.get<MrtaService>(MrtaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
