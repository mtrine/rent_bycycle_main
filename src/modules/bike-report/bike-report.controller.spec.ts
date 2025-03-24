import { Test, TestingModule } from '@nestjs/testing';
import { BikeReportController } from './bike-report.controller';
import { BikeReportService } from './bike-report.service';

describe('BikeReportController', () => {
  let controller: BikeReportController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BikeReportController],
      providers: [BikeReportService],
    }).compile();

    controller = module.get<BikeReportController>(BikeReportController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
