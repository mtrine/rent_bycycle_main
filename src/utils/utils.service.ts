import * as bcrypt from 'bcrypt';

export class UtilsService {
    static getSelectData(select: Array<string>) {
        return Object.fromEntries(select.map((item) => [item, 1]));
    }

    static unGetSelectData(select: Array<string>) {
        return Object.fromEntries(select.map((item) => [item, 0]));
    }

    static async hashPassword(password: string) {
        const hashPassword = await bcrypt.hash(password, 10);
        return hashPassword;
    }

    static async comparePassword(password: string, hashPassword: string) {
        const compare = await bcrypt.compare(password, hashPassword);
        return compare;
    }

    static removeUndefinedAndNull(obj: Record<string, any>) {
        // Duyệt qua tất cả các khóa của đối tượng
        Object.keys(obj).forEach(key => {
            // Nếu giá trị là null, undefined hoặc chuỗi rỗng, xóa thuộc tính đó
            if (obj[key] === undefined || obj[key] === null || obj[key] === '' || obj[key] === "Invalid Date") {
                delete obj[key];
            }
            // Nếu giá trị là đối tượng, gọi đệ quy để xử lý
            else if (typeof obj[key] === 'object' && obj[key] !== null) {
                this.removeUndefinedAndNull(obj[key]);
            }
        });
        return obj;
    }

    static removeUndefinedAndNullFromArray(arr: any[]) {
        const objectAfterRemove = arr.map(item => this.removeUndefinedAndNull(item));
        return objectAfterRemove;
    }

    static paginateResponse<T>(items: T[], limit: number, page: number) {
        const totalPages = Math.ceil(items.length / limit);

        return {
            metadata: {
                totalPages,
                currentPage: page,
                limit,
                totalItems: items.length,
            },
            data: items,
        };
    }
}