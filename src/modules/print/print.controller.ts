import { Controller, Get, Query, Res,  UseGuards } from '@nestjs/common';
import { PrintService } from './print.service';
import { Response } from 'express';
import { Public } from 'src/decorators/public.decorator';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/enums/role.enum';
import { ResponseMessage } from 'src/decorators/response-message.decorator';

@Controller('print')
export class PrintController {
  constructor(private readonly printService: PrintService) { }

  @Get()
  @Roles(Role.ADMIN)
  @ResponseMessage('Create PDF successfully')
  async downloadPdf(@Query('bikeId') bikeId: string, @Res() res: Response) {
    try {
      const pdfPath = await this.printService.generatePdfFromImage(bikeId);

      // Gửi file PDF về cho người dùng
      res.download(pdfPath, `${bikeId}.pdf`, (err) => {
        if (err) {
          res.status(500).send('Lỗi khi tải file PDF');
        }
        // Tùy chọn: Xóa file sau khi gửi để tránh lưu trữ thừa
        // fs.unlinkSync(pdfPath);
      });
    } catch (error) {
      // Xử lý lỗi từ CustomException hoặc lỗi khác
      res.status(400).json({ message: error.message });
    }
  }
}
