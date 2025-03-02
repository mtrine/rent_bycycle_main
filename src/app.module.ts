import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { BicyclesModule } from './modules/bicycles/bicycles.module';
import { StationsModule } from './modules/stations/stations.module';
import { RentalsModule } from './modules/rentals/rentals.module';
import { BikesModule } from './modules/bikes/bikes.module';
import { TransactionsModule } from './modules/transactions/transactions.module';

@Module({
  imports: [UsersModule, AuthModule, BicyclesModule, StationsModule, RentalsModule, BikesModule, TransactionsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
