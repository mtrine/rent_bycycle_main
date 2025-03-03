import { Module } from '@nestjs/common';
import { KeyTokenService } from './key-token.service';
import { MongooseModule } from '@nestjs/mongoose';
import { KeyToken, KeyTokenSchema } from './schemas/key-token.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: KeyToken.name,
        schema: KeyTokenSchema,
      },
    ])
  ],
  providers: [KeyTokenService],
  exports: [KeyTokenService]
})
export class KeyTokenModule {}
