import { Body, Inject, Injectable } from '@nestjs/common';

import { UsersRepository } from '../users/user.repository';
import { ConfigService } from '@nestjs/config';
import { FirebaseService } from '../firebase/firebase.service';
import * as admin from "firebase-admin";
@Injectable()
export class OtpTokenService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly firebaseService: FirebaseService,
  ) {

  }

  // async create(phoneNumber: string, recaptchaToken: string) {
  //   const token = Math.floor(1000 + Math.random() * 9000).toString();
  //   const otpToken = await this.otpTokenRepository.createOtpToken(phoneNumber, token);
  //   return otpToken;
  // }

  // async verify(phoneNumber: string, token: string) {
  //   const otpToken = await this.otpTokenRepository.verifyOtp(phoneNumber, token);
  //   if (!otpToken) {
  //     return false;
  //   }
  //   this.usersRepository.verifyUser(phoneNumber);
  //   return;
  // }

  async verifyOtp(idToken: string) {
    try {
      const decodedToken = await this.firebaseService.verifyIdToken(idToken);
      let phoneNumber = decodedToken.phone_number;

      // Chuyển số điện thoại từ +84xxxxxxxxx → 0xxxxxxxxx
      phoneNumber = phoneNumber.replace(/^\+84/, '0');
      const vertify = await this.usersRepository.verifyUser(phoneNumber);
      if (vertify) {
        return { message: 'Xác thực thành công', phoneNumber };;
      }
      throw new Error('Xác minh OTP thất bại');
    } catch (error) {
      console.log("error", error);
      throw new Error('Xác minh OTP thất bại');
    }
  }
}
