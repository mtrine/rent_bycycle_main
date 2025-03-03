import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from 'src/modules/auth/auth.service';
import { CustomException } from 'src/exception-handle/custom-exception';
import { ErrorCode } from 'src/enums/error-code.enum';


@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
	constructor(private readonly auth_service: AuthService) {
		super({ usernameField: 'phoneNumber' }); 
	}

	async validate(email: string, password: string) {
        if(!password){
            throw new CustomException(ErrorCode.PASSWORD_IS_NOT_EMPTY)
        }
		const user = await this.auth_service.validateUser(email, password);
		if (!user) {
			throw new CustomException(ErrorCode.USER_NOT_REGISTER);
		}
		return user;
	}
}
