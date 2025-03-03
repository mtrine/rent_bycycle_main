import { Injectable } from '@nestjs/common';
import { UsersRepository } from '../users/user.repository';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { CustomException } from 'src/exception-handle/custom-exception';
import { ErrorCode } from 'src/enums/error-code.enum';
import { UserInterface } from '../users/dto/user.interface';
import { access_token_private_key, access_token_public_key, refresh_token_private_key, refresh_token_public_key } from 'src/constants/jwt.constants';
import { Response } from 'express';
import * as ms from 'ms';
import { KeyTokenService } from '../key-token/key-token.service';
import { CreateUserDto } from '../users/dto/create-user.dto';

@Injectable()
export class AuthService {
    constructor(
        private readonly userRepository: UsersRepository,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
        private readonly keyTokenService: KeyTokenService,
    ) { }

    async validateUser(phoneNumber: string, password: string) {
        const user = await this.userRepository.findByPhoneNumber(phoneNumber);
        if (user) {
            const isTruePassword = await bcrypt.compare(password, user.password);
            if (!isTruePassword) {
                throw new CustomException(ErrorCode.PASSWORD_IS_NOT_MATCH);
            }
            return user;
        }
        return null;
    }


    async login(user: UserInterface, res: Response) {
        const payload = {
            sub: "token login",
            iss: "from server",
            _id: user._id,
            role: user.role,
        }
        const accessToken = this.generateAccessToken(payload, access_token_private_key);
        const refreshToken = this.generateRefreshToken(payload, refresh_token_private_key);
        const publicKey = await this.keyTokenService.createKeyToken(user._id.toString(), access_token_public_key, access_token_private_key, refresh_token_public_key, refresh_token_private_key, refreshToken);
        if (!publicKey) {
            throw new CustomException(ErrorCode.PUBLICKEY_ERROR);
        }
        res.cookie('refresh_token', refreshToken, {
            httpOnly: true,
            secure: this.configService.get<string>('NODE_ENV') === 'production' ? true : false,
            maxAge: +ms(this.configService.get<string>('JWT_REFRESH_TOKEN_EXPIRATION_TIME')),
            sameSite: 'none'
        })

        res.cookie('access_token', accessToken, {
            httpOnly: true,
            secure: this.configService.get<string>('NODE_ENV') === 'production' ? true : false,
            maxAge: +ms(this.configService.get<string>('JWT_ACCESS_TOKEN_EXPIRATION_TIME')),
            sameSite: 'none'
        })

        return {
            user_id: user._id,
            user_role: user.role,
        };
    }

    async register(dto: CreateUserDto, res: Response) {
        const foundUser = await this.userRepository.findByPhoneNumber(dto.phoneNumber);
        if (foundUser) {
            throw new CustomException(ErrorCode.PHONE_NUMBER_IS_EXIST);
        }
        const user = await this.userRepository.create(dto)
        if (user) {
            const payload = {
                sub: "token login",
                iss: "from server",
                _id: user._id,
                role: user.role,
            }
            const accessToken = this.generateAccessToken(payload, access_token_private_key);
            const refreshToken = this.generateRefreshToken(payload, refresh_token_private_key);
            const publicKey = await this.keyTokenService.createKeyToken(user._id.toString(), access_token_public_key, access_token_private_key, refresh_token_public_key, refresh_token_private_key, refreshToken);
            if (!publicKey) {
                throw new CustomException(ErrorCode.PUBLICKEY_ERROR);
            }
            res.cookie('refresh_token', refreshToken, {
                httpOnly: true,
                secure: this.configService.get<string>('NODE_ENV') === 'production' ? true : false,
                maxAge: +ms(this.configService.get<string>('JWT_REFRESH_TOKEN_EXPIRATION_TIME')),
                sameSite: 'none'
            })

            res.cookie('access_token', accessToken, {
                httpOnly: true,
                secure: this.configService.get<string>('NODE_ENV') === 'production' ? true : false,
                maxAge: +ms(this.configService.get<string>('JWT_ACCESS_TOKEN_EXPIRATION_TIME')),
                sameSite: 'none'
            })
        }
        return {
            user_id: user._id,
            user_role: user.role,
        };
    }

    async handleRefreshToken(refreshToken: string, res: Response) {
        if (!refreshToken) {
            throw new CustomException(ErrorCode.REFRESH_TOKEN_NOT_FOUND);
        }
        // Kiểm tra nếu refresh token đã được sử dụng
        const foundToken = await this.keyTokenService.findByRefreshTokenUsed(refreshToken);
        if (foundToken) {
            const { _id } = await this.jwtService.verifyAsync(refreshToken, {
                secret: foundToken.refresh_privateKey,
            });
            await this.keyTokenService.deleteKeyById(foundToken._id.toString());
            throw new CustomException(ErrorCode.REFRESH_TOKEN_ERROR);
        }

        // Tìm refresh token trong database
        const holderToken = await this.keyTokenService.findByRefreshToken(refreshToken);
        if (!holderToken) {
            throw new CustomException(ErrorCode.USER_NOT_REGISTER);
        }

        let decodedToken: any;
        try {
            // Xác minh token và bắt lỗi hết hạn
            decodedToken = await this.jwtService.verifyAsync(refreshToken, {
                secret: holderToken.refresh_privateKey,
            });
        } catch (error) {
            if (error.name === 'TokenExpiredError') {
                throw new CustomException(ErrorCode.REFRESH_TOKEN_EXPIRED);
            }
            throw new CustomException(ErrorCode.REFRESH_TOKEN_INVALID);
        }

        // Kiểm tra user từ decodedToken
        const foundUser = await this.userRepository.findById(decodedToken._id);
        if (!foundUser) {
            throw new CustomException(ErrorCode.USER_NOT_REGISTER);
        }

        // Tạo access token và refresh token mới
        const payload = {
            sub: 'token login',
            iss: 'from server',
            _id: foundUser._id,
            role: foundUser.role,
        };
        const accessToken = this.generateAccessToken(payload, holderToken.access_privateKey);
        const newRefreshToken = this.generateRefreshToken(payload, holderToken.refresh_privateKey);

        // Cập nhật refresh token trong cơ sở dữ liệu
        await this.keyTokenService.updateKeyToken(holderToken._id.toString(), refreshToken, newRefreshToken);

        res.cookie('refresh_token', refreshToken, {
            httpOnly: true,
            secure: this.configService.get<string>('NODE_ENV') === 'production' ? true : false,
            // secure: true,
            maxAge: +ms(this.configService.get<string>('JWT_ACCESS_TOKEN_EXPIRATION_TIME')),
            sameSite: 'none'
        })

        res.cookie('access_token', accessToken, {
            httpOnly: true,
            secure: this.configService.get<string>('NODE_ENV') === 'production' ? true : false,
            maxAge: +ms(this.configService.get<string>('JWT_REFRESH_TOKEN_EXPIRATION_TIME')),
            sameSite: 'none'
        })

        return {
            user_id: foundUser._id,
            user_role: foundUser.role,
        };
    }

    //Handle JWT
    generateAccessToken(payload: any, access_token_private_key: string) {
        return this.jwtService.sign(payload, {
            algorithm: 'RS256',
            privateKey: access_token_private_key,
            expiresIn: this.configService.get<string>(
                'JWT_ACCESS_TOKEN_EXPIRATION_TIME',
            ),
        });
    }

    generateRefreshToken(payload: any, refresh_token_private_key: string) {
        return this.jwtService.sign(payload, {
            algorithm: 'RS256',
            privateKey: refresh_token_private_key,
            expiresIn: this.configService.get<string>(
                'JWT_REFRESH_TOKEN_EXPIRATION_TIME',
            ),
        });
    }

    async logout(refreshToken: string, res: Response) {
        // Remove the refresh token from the database
        await this.keyTokenService.deleteByRefreshToken(refreshToken);

        // Clear the cookies
        res.clearCookie('refresh_token');
        res.clearCookie('access_token');

        return { message: 'Logout successful' };
    }
}
