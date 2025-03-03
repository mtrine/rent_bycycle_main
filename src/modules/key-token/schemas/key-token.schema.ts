import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({ timestamps: true })
export class KeyToken {
    @Prop({
        required: true,
        ref: 'User'
    })
    userId: string;
    @Prop({
        required: true
    })
    access_privateKey: string;

    @Prop({
        required: true
    })
    access_publicKey: string;

    @Prop({
        required: true
    })
    refresh_privateKey: string;

    @Prop({
        required: true
    })
    refresh_publicKey: string;

    @Prop({
        default: []
    })
    refreshTokensUsed: string[];

    @Prop({
        required: true,
    })
    refreshToken: string;
}

export const KeyTokenSchema = SchemaFactory.createForClass(KeyToken);
