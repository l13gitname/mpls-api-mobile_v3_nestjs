import { Test, TestingModule } from '@nestjs/testing';
import { ViewsignService } from './viewsign.service';

describe('ViewsignService', () => {
  let service: ViewsignService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ViewsignService],
    }).compile();

    service = module.get<ViewsignService>(ViewsignService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
