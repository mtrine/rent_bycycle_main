import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Transaction } from "./schemas/transaction.schemas";
import { Model } from "mongoose";
import { CreateTransactionDto } from "./dto/create-transaction.dto";

@Injectable()
export class TransactionsRepository {
    constructor(
        @InjectModel(Transaction.name) private transactionModel: Model<Transaction>
    ) { }

    async createTransaction(dto: CreateTransactionDto) {
        const transactionData: any = {
            userId: dto.userId,
            amount: dto.amount,
            paymentMethod: dto.paymentMethod,
            type: dto.type,
            rentalId: dto.rentalId,
        };

        if (dto.status) {
            transactionData.status = dto.status;
        }

        return await this.transactionModel.create(transactionData);
    }

    async updateStatus(id: string, status: string) {
        return await this.transactionModel.findByIdAndUpdate(id, {
            $set: {
                status,
                expiresAt: null
            }
        }, { new: true }).lean();
    }

    async getMyTransactions(userId: string) {
        return await this.transactionModel.find({ userId }).lean();
    }
}