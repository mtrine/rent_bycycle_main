import { Injectable } from '@nestjs/common';
import { CreateKeyTokenDto } from './dto/create-key-token.dto';
import { UpdateKeyTokenDto } from './dto/update-key-token.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { access } from 'fs';
import { KeyToken } from './schemas/key-token.schema';


@Injectable()
export class KeyTokenService {
  constructor(
    @InjectModel(KeyToken.name) private keyTokenModel: Model<KeyToken>
  ) { }

  async createKeyToken(user: string, access_publicKey: string, access_privateKey: string, refresh_publicKey: string, refresh_privateKey: string ,refreshToken: string) {

    const filter =
    {
      userId: user
    }, update = {
      access_publicKey: access_publicKey,
      access_privateKey: access_privateKey,
      refresh_publicKey: refresh_publicKey,
      refresh_privateKey: refresh_privateKey,
      refreshTokensUsed: [],
      refreshToken
    }, option = { upsert: true, new: true }
    const token = await this.keyTokenModel.findOneAndUpdate(filter, update, option)
    return token ? {
      access_publicKey: token.access_publicKey,
      refresh_publicKey: token.refresh_publicKey
    } : null
  }

  async queryKeyToken(query: any) {
    return this.keyTokenModel.findOne(query).lean()
  }

  async removeToken(userId: string) {
    return this.keyTokenModel.findOneAndDelete({ userId })
  }

  async findByRefreshTokenUsed(refreshToken: string) {
    return this.keyTokenModel.findOne({ refreshTokensUsed: refreshToken }).lean()
  }

  async deleteKeyById(id: string) {
    return this.keyTokenModel.findByIdAndDelete(id).lean()
  }

  async findByRefreshToken(refreshToken: string) {
    return this.keyTokenModel.findOne({ refreshToken }).lean()
  }

  async updateKeyToken(id: string, oldRefreshToken: string, newRefreshToken: string) {
    return this.keyTokenModel.updateOne(
      { _id: id },
      {
        $set: { refreshToken: newRefreshToken },
        $addToSet: { refreshTokensUsed: oldRefreshToken }
      })
  }
}
