import { HttpStatus } from '@nestjs/common';

export class ErrorCode {
    static readonly NOT_FOUND = new ErrorCode(1404, 'Not found', HttpStatus.NOT_FOUND);
    static readonly UNAUTHORIZED = new ErrorCode(1401, 'Unauthorized', HttpStatus.UNAUTHORIZED)
    static readonly USER_EXIST = new ErrorCode(1400, 'User exist', HttpStatus.BAD_REQUEST)
    static readonly PUBLICKEY_ERROR = new ErrorCode(1402, 'Public error', HttpStatus.BAD_REQUEST)
    static readonly REFRESH_TOKEN_ERROR = new ErrorCode(1403, 'Something wrong happend !! Pls reLogin', HttpStatus.FORBIDDEN)
    static readonly USER_NOT_REGISTER = new ErrorCode(1405, 'User not register', HttpStatus.UNAUTHORIZED)
    static readonly REFRESH_TOKEN_EXPIRED = new ErrorCode(1406, 'Refresh token expired', HttpStatus.FORBIDDEN)
    static readonly REFRESH_TOKEN_INVALID = new ErrorCode(1407, 'Refresh token invalid', HttpStatus.FORBIDDEN)
    static readonly INVALID_TOKEN = new ErrorCode(1408, 'Invalid token', HttpStatus.FORBIDDEN)
    static readonly FORBIDDEN = new ErrorCode(1409, 'Don\'t have permission', HttpStatus.FORBIDDEN)
    static readonly PASSWORD_IS_NOT_EMPTY = new ErrorCode(1410, 'Password not empty', HttpStatus.BAD_REQUEST)
    static readonly PASSWORD_IS_NOT_MATCH = new ErrorCode(1411, 'Password is not match', HttpStatus.BAD_REQUEST)
    static readonly PHONE_NUMBER_IS_EXIST = new ErrorCode(1412, 'Phone number is exist', HttpStatus.BAD_REQUEST)
    static readonly REFRESH_TOKEN_NOT_FOUND = new ErrorCode(1413, 'Refresh token not found', HttpStatus.FORBIDDEN)
    static readonly NOT_ENOUGH_MONEY = new ErrorCode(1414, 'Not enough money', HttpStatus.BAD_REQUEST)
    static readonly BIKE_ALREADY_RETURNED = new ErrorCode(1415, 'Bike already returned', HttpStatus.BAD_REQUEST)
    static readonly INVALID_COORDINATES = new ErrorCode(1416, 'Invalid coordinates', HttpStatus.BAD_REQUEST)
    static readonly NOT_STAY_AT_STATION = new ErrorCode(1417, 'Not stay at station', HttpStatus.BAD_REQUEST)
    static readonly BIKE_ALREADY_RENTED = new ErrorCode(1418, 'Bike already rented', HttpStatus.BAD_REQUEST)
    constructor(public readonly code: number, public readonly message: string, public readonly status: HttpStatus) { }

    toJSON() {
        return {
            code: this.code,
            message: this.message,
            status: this.status,
        };
    }
}
