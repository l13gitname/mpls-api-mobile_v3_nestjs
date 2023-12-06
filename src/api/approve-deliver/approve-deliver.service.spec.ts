import { Test, TestingModule } from '@nestjs/testing';
import { ApproveDeliverService } from './approve-deliver.service';

describe('ApproveDeliverService', () => {
  let service: ApproveDeliverService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ApproveDeliverService],
    }).compile();

    service = module.get<ApproveDeliverService>(ApproveDeliverService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
