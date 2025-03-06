import { Injectable } from '@nestjs/common';
import * as PDFDocument from 'pdfkit';
import * as fs from 'fs';
import { BikesRepository } from '../bikes/bikes.repository';
import { CustomException } from 'src/exception-handle/custom-exception';
import { ErrorCode } from 'src/enums/error-code.enum';
@Injectable()
export class PrintService {
    constructor(
        private readonly bikeRepository: BikesRepository
    ) { }
    async generatePdfFromImage(bikeId: string): Promise<string> {
        const bike = await this.bikeRepository.findById(bikeId);
        if (!bike) {
            throw new CustomException(ErrorCode.NOT_FOUND);
        }

        const imagePath = `public/qrcodes/${bike.qrCode}.png`;
        const outputPath = `public/pdfs/${bike.qrCode}.pdf`; // Đường dẫn file PDF động

        // Đảm bảo thư mục public/pdfs tồn tại
        const dir = 'public/pdfs';
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        return new Promise((resolve, reject) => {
            const doc = new PDFDocument();
            const stream = fs.createWriteStream(outputPath);

            doc.pipe(stream);
            doc.image(imagePath, {
                fit: [500, 500], // Kích thước hình ảnh trong PDF
                align: 'center',
                valign: 'center',
            });
            doc.end();

            stream.on('finish', () => resolve(outputPath));
            stream.on('error', (err) => reject(err));
        });
    }
}
