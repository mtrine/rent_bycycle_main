import { Test, TestingModule } from '@nestjs/testing';
import { OtpTokenController } from './otp-token.controller';
import { OtpTokenService } from './otp-token.service';

describe('OtpTokenController', () => {
  let controller: OtpTokenController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OtpTokenController],
      providers: [OtpTokenService],
    }).compile();

    controller = module.get<OtpTokenController>(OtpTokenController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
