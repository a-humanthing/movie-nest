import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

@Injectable()
export class S3Service {
    private client: S3Client;
    private bucket: string;

    constructor(
        private readonly configService: ConfigService,
    ) {
        const s3_region = this.configService.get('S3_REGION');

        if (!s3_region) {
            throw new Error('S3_REGION not found in environment variables');
        }

        this.client = new S3Client([{
            region: s3_region,
            credentials: {
                accessKeyId: this.configService.get('S3_ACCESS_KEY_ID'),
                secretAccessKey: this.configService.get('S3_SECRET_ACCESS_KEY'),
            },
            forcePathStyle: true,
        }]);

    }

    async getSignedUrl(fileName: string, fileType: string): Promise<{ url: string }> {
        const command = new PutObjectCommand({
          Bucket: this.bucket,
          Key: fileName,
          ContentType: fileType,
        });
    
        const url = await getSignedUrl(this.client,command,{expiresIn: 60 * 10});
    
        return {url};
    }

    async deleteFile(key: string) {
        try {
          const command = new DeleteObjectCommand({
            Bucket: this.bucket,
            Key: key,
          });
     
          await this.client.send(command);
     
          return { message: 'File deleted successfully' };
        } catch (error) {
          throw new InternalServerErrorException(error);
        }
      }
    

}
