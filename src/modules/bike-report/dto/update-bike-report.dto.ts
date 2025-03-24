import { PartialType } from '@nestjs/mapped-types';
import { CreateBikeReportDto } from './create-bike-report.dto';

export class UpdateBikeReportDto extends PartialType(CreateBikeReportDto) {}
