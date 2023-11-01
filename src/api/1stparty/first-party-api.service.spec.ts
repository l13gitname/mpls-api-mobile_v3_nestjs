import { Test, TestingModule } from '@nestjs/testing';
import { FirstPartyApiService } from './first-party-api.service';

describe('FirstPartyApiService', () => {
  let service: FirstPartyApiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FirstPartyApiService],
    }).compile();

    service = module.get<FirstPartyApiService>(FirstPartyApiService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
