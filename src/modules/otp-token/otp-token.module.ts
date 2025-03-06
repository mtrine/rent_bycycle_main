import { Module } from '@nestjs/common';
import { OtpTokenService } from './otp-token.service';
import { OtpTokenController } from './otp-token.controller';

import { UsersModule } from '../users/users.module';
import { FirebaseModule } from '../firebase/firebase.module';


@Module({
  imports: [
    UsersModule,
    FirebaseModule,
   
  ],
  controllers: [OtpTokenController],
  providers: [OtpTokenService],
})
export class OtpTokenModule { }
