import { Test, TestingModule } from '@nestjs/testing';
import { ApproveDeliverController } from './approve-deliver.controller';

describe('ApproveDeliverController', () => {
  let controller: ApproveDeliverController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ApproveDeliverController],
    }).compile();

    controller = module.get<ApproveDeliverController>(ApproveDeliverController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
