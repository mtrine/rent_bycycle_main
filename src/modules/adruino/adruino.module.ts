import { Module } from '@nestjs/common';
import { AdruinoService } from './adruino.service';

@Module({
  providers: [AdruinoService],
})
export class AdruinoModule {}
