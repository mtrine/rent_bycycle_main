import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { StationsModule } from './modules/stations/stations.module';
import { RentalsModule } from './modules/rentals/rentals.module';
import { BikesModule } from './modules/bikes/bikes.module';
import { TransactionsModule } from './modules/transactions/transactions.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { KeyTokenModule } from './modules/key-token/key-token.module';
import { OtpTokenModule } from './modules/otp-token/otp-token.module';
import { FirebaseModule } from './modules/firebase/firebase.module';
import { PrintModule } from './modules/print/print.module';
import { ZalopayPaymentModule } from './modules/zalopay-payment/zalopay-payment.module';
import { DatabaseModule } from './modules/database/database.module';

@Module({
  imports: [
    ConfigModule.forRoot({ 
      isGlobal: true 
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URI'),
      }),
      inject: [ConfigService],
    }),
    UsersModule, 
    AuthModule, 
    StationsModule, 
    RentalsModule, 
    BikesModule, 
    TransactionsModule,
    KeyTokenModule,
    OtpTokenModule,
    FirebaseModule,
    PrintModule,
    ZalopayPaymentModule,
    DatabaseModule

  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
