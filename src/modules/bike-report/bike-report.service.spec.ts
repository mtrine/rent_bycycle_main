import { Test, TestingModule } from '@nestjs/testing';
import { BikeReportService } from './bike-report.service';

describe('BikeReportService', () => {
  let service: BikeReportService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BikeReportService],
    }).compile();

    service = module.get<BikeReportService>(BikeReportService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
