import { Test, TestingModule } from '@nestjs/testing';
import { FirstPartyApiMultipleService } from './first-party-api-multiple.service';

describe('FirstPartyApiMultipleService', () => {
  let service: FirstPartyApiMultipleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FirstPartyApiMultipleService],
    }).compile();

    service = module.get<FirstPartyApiMultipleService>(FirstPartyApiMultipleService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
