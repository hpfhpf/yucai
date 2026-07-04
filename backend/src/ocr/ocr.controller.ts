import { Controller, Post, UploadedFile, UseInterceptors, HttpException, HttpStatus } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { OcrService } from './ocr.service';

@Controller('ocr')
export class OcrController {
  constructor(private readonly ocrService: OcrService) {}

  @Post('recognize')
  @UseInterceptors(FileInterceptor('image'))
  async recognize(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new HttpException('请上传图片', HttpStatus.BAD_REQUEST);
    }

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(file.mimetype)) {
      throw new HttpException('仅支持 JPG、PNG、GIF 格式的图片', HttpStatus.BAD_REQUEST);
    }

    try {
      const text = await this.ocrService.recognizeText(file.buffer);
      return {
        success: true,
        text: text || '',
      };
    } catch {
      throw new HttpException('图片识别失败，请重试', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('recognize-base64')
  async recognizeBase64(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new HttpException('请上传图片', HttpStatus.BAD_REQUEST);
    }

    try {
      const base64 = file.buffer.toString('base64');
      const text = await this.ocrService.recognizeFromBase64(base64);
      return {
        success: true,
        text: text || '',
      };
    } catch {
      throw new HttpException('图片识别失败，请重试', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}