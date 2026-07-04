import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as https from 'https';
import * as querystring from 'querystring';

@Injectable()
export class OcrService {
  private readonly secretId: string;
  private readonly secretKey: string;

  constructor(private readonly configService: ConfigService) {
    this.secretId = this.configService.get<string>('TENCENT_SECRET_ID', '');
    this.secretKey = this.configService.get<string>('TENCENT_SECRET_KEY', '');
  }

  private async requestOCR(imageBase64: string): Promise<string> {
    if (!this.secretId || !this.secretKey) {
      return this.fallbackOCR(imageBase64);
    }

    return new Promise((resolve) => {
      const url = 'https://ocr.tencentcloudapi.com/';
      const params = {
        Action: 'GeneralBasicOCR',
        Version: '2018-11-19',
        Region: 'ap-chengdu',
        ImageBase64: imageBase64,
      };

      const postData = querystring.stringify(params);
      const options: https.RequestOptions = {
        method: 'POST',
        hostname: 'ocr.tencentcloudapi.com',
        path: '/',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Content-Length': Buffer.byteLength(postData),
        },
      };

      const req = https.request(options, (res) => {
        let data = '';
        res.on('data', (chunk) => {
          data += chunk;
        });
        res.on('end', () => {
          try {
            const result = JSON.parse(data);
            const text = result.Response?.TextDetections?.map((item: any) => item.DetectedText).join('\n') || '';
            resolve(text);
          } catch {
            resolve('');
          }
        });
      });

      req.on('error', () => {
        resolve('');
      });

      req.write(postData);
      req.end();
    });
  }

  private async fallbackOCR(imageBase64: string): Promise<string> {
    const url = 'https://aip.baidubce.com/rest/2.0/ocr/v1/general_basic';
    const apiKey = this.configService.get<string>('BAIDU_OCR_API_KEY', '');
    const secretKey = this.configService.get<string>('BAIDU_OCR_SECRET_KEY', '');

    if (!apiKey || !secretKey) {
      return '';
    }

    return new Promise((resolve) => {
      const authUrl = `https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=${apiKey}&client_secret=${secretKey}`;

      https.get(authUrl, (res) => {
        let authData = '';
        res.on('data', (chunk) => {
          authData += chunk;
        });
        res.on('end', () => {
          try {
            const token = JSON.parse(authData).access_token;
            const postData = querystring.stringify({
              image: imageBase64,
            });

            const options: https.RequestOptions = {
              method: 'POST',
              hostname: 'aip.baidubce.com',
              path: `/rest/2.0/ocr/v1/general_basic?access_token=${token}`,
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': Buffer.byteLength(postData),
              },
            };

            const req = https.request(options, (ocrRes) => {
              let ocrData = '';
              ocrRes.on('data', (chunk) => {
                ocrData += chunk;
              });
              ocrRes.on('end', () => {
                try {
                  const result = JSON.parse(ocrData);
                  const text = result.words_result?.map((item: any) => item.words).join('\n') || '';
                  resolve(text);
                } catch {
                  resolve('');
                }
              });
            });

            req.on('error', () => {
              resolve('');
            });

            req.write(postData);
            req.end();
          } catch {
            resolve('');
          }
        });
      }).on('error', () => {
        resolve('');
      });
    });
  }

  async recognizeText(imageBuffer: Buffer): Promise<string> {
    const base64 = imageBuffer.toString('base64');
    return this.requestOCR(base64);
  }

  async recognizeFromBase64(base64: string): Promise<string> {
    const cleanBase64 = base64.replace(/^data:image\/\w+;base64,/, '');
    return this.requestOCR(cleanBase64);
  }
}