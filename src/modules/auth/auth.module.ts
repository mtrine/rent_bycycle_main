import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtAccessTokenStrategy } from 'src/strategies/jwt-access.strategy';
import { LocalStrategy } from 'src/strategies/local.strategy';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { KeyTokenModule } from '../key-token/key-token.module';

@Module({
  imports : [
    PassportModule,
    UsersModule,
    KeyTokenModule,
    JwtModule.register({
      signOptions: {
        algorithm: 'RS256',
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtAccessTokenStrategy, LocalStrategy],
})
export class AuthModule {}
