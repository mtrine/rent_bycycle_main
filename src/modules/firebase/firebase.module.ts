import { Module } from '@nestjs/common';
import { FirebaseService } from './firebase.service';
import { ConfigService } from '@nestjs/config';
// var admin = require("firebase-admin");

// var serviceAccount = require("./bikey-d2405Firebase.json");

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount)
// });
@Module({
  providers: [FirebaseService],
  exports: [FirebaseService],
})
export class FirebaseModule { }
