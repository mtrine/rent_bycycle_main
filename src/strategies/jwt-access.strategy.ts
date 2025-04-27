import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { access_token_public_key } from '../constants/jwt.constants'
import { CustomException } from 'src/exception-handle/custom-exception';
import { ErrorCode } from 'src/enums/error-code.enum';
import { UsersRepository } from 'src/modules/users/user.repository';

@Injectable()
export class JwtAccessTokenStrategy extends PassportStrategy(Strategy) {
    constructor(
        private readonly userRepository: UsersRepository,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                (request: Request) => {
                    return request?.cookies?.access_token || null;
                }
            ]),
            ignoreExpiration: false,
            secretOrKey: access_token_public_key,
        });
    }

    async validate(payload: any) {
        const user = await this.userRepository.findById(payload._id)
        if (!user) throw new CustomException(ErrorCode.USER_NOT_REGISTER)
        return {
            _id: user._id,
            fullName: user.fullName,
            user_role: user.role,
        };
    }
}
