import { Module } from '@nestjs/common';
// import { AdruinoService } from './adruino.service';
// import { AdruinoController } from './adruino.controller';
import { SerialPort } from 'serialport';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  // controllers: [AdruinoController],
  providers: [
    // AdruinoService,
    // {
    //   provide: 'SERIAL_PORT', // Sử dụng string token để tránh xung đột với class SerialPort
    //   useFactory: (configService: ConfigService) => {
    //     return new SerialPort({
    //       path: configService.get<string>('ARDUINO_PORT') || 'COM5',
    //       baudRate: 9600,
    //     });
    //   },
    //   inject: [ConfigService],
    // },
  ],
  // exports: [AdruinoService],
})
export class AdruinoModule {}
