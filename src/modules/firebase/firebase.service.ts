import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
var admin = require("firebase-admin");

@Injectable()
export class FirebaseService {
  constructor(
    private readonly configService: ConfigService
  ) {
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: configService.get<string>('FIREBASE_PROJECT_ID'),
          privateKey: configService.get<string>('FIREBASE_PRIVATE_KEY')?.replace(/\\n/g, '\n'),
          clientEmail: configService.get<string>('FIREBASE_CLIENT_EMAIL'),
        }),
      });
    }
  }

  async verifyPhoneNumber(phoneNumber: string): Promise<any> {
    // Logic gửi OTP sẽ được xử lý ở phía client, backend chỉ cần xác minh
    return admin.auth().getUserByPhoneNumber(phoneNumber);
  }

  async verifyIdToken(idToken: string) {
    return admin.auth().verifyIdToken(idToken);
  }
}
