import {
  Inject,
  Injectable,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { SerialPort } from 'serialport';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AdruinoService implements OnModuleInit, OnModuleDestroy {
  constructor(
    private configService: ConfigService,
    @Inject('SERIAL_PORT') private port: SerialPort, // Inject SerialPort với token 'SERIAL_PORT'
  ) {}

  onModuleInit() {
    this.port.on('open', () => console.log('Arduino connected!'));
    this.port.on('error', (err) => console.error('Arduino error:', err));
  }

  sendSignal(signal: string) {
    if (this.port && this.port.isOpen) {
      this.port.write(signal, (err) => {
        if (err) console.error('Error sending signal:', err);
      });
    } else {
      console.error('Serial port is not open!');
    }
  }

  onModuleDestroy() {
    if (this.port && this.port.isOpen) {
      this.port.close((err) => {
        if (err) console.error('Error closing port:', err);
        else console.log('Serial port closed');
      });
    }
  }
}
