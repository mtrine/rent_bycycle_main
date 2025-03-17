import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { User } from "./schemas/user.schema";
import { Model } from "mongoose";
import { CreateUserDto } from "./dto/create-user.dto";
import * as bcrypt from 'bcrypt';
import { UtilsService } from "src/utils/utils.service";
@Injectable()
export class UsersRepository {
    constructor(
        @InjectModel(User.name) private userModel: Model<User>
    ) { }

    async create(dto: CreateUserDto) {
        const hashedPassword = await bcrypt.hash(dto.password.toString(), 10);
        return await this.userModel.create({
            phoneNumber: dto.phoneNumber,
            fullName: dto.fullName,
            dateOfBirth: dto.dateOfBirth,
            gender: dto.gender,
            password: hashedPassword
        });
    }

    async findByPhoneNumber(phoneNumber: string) {
        return await this.userModel.findOne({
            phoneNumber
        }).lean();
    }

    async findById(id: string,unSelects: string[] = []) {
        return await this.userModel.findById(id).select(UtilsService.unGetSelectData(unSelects));
    }

    async updateWallet(id: string, amount: number) {
        return await this.userModel.findByIdAndUpdate(id, {
            $inc: { 'wallet.balance': amount },
            $set: { 'wallet.lastUpdated': new Date() }
        }, { new: true }).lean();
    }

    async verifyUser(phoneNumber: string) {
        return this.userModel.updateOne(
            { phoneNumber },
            { $set: { isVerified: true } },
        );
    }
}