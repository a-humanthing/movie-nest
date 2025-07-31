import { Injectable, InternalServerErrorException, BadRequestException } from '@nestjs/common';
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

@Injectable()
export class S3Service {
    // private client: S3Client;
    // private bucket: string;

    // constructor(
    //     private readonly configService: ConfigService,
    // ) {
    //     const s3Region = this.configService.get<string>('S3_REGION');
    //     const s3AccessKeyId = this.configService.get<string>('S3_ACCESS_KEY_ID');
    //     const s3SecretAccessKey = this.configService.get<string>('S3_SECRET_ACCESS_KEY');
    //     const bucketName = this.configService.get<string>('S3_BUCKET_NAME');

    //     if (!s3Region || !s3AccessKeyId || !s3SecretAccessKey || !bucketName) {
    //         throw new Error('Missing required S3 configuration');
    //     }

    //     this.bucket = bucketName;

    //     this.client = new S3Client({
    //         region: s3Region,
    //         credentials: {
    //             accessKeyId: s3AccessKeyId,
    //             secretAccessKey: s3SecretAccessKey,
    //         }
    //     });
    // }

    // async getSignedUrl(fileName: string, fileType: string): Promise<{ url: string }> {
    //     if (!fileName || !fileType) {
    //         throw new BadRequestException('File name and type are required');
    //     }

    //     const command = new PutObjectCommand({
    //         Bucket: this.bucket,
    //         Key: fileName,
    //         ContentType: fileType,
    //     });

    //     try {
    //         const url = await getSignedUrl(this.client, command, { expiresIn: 600 });
    //         return { url };
    //     } catch (error) {
    //         throw new InternalServerErrorException('Failed to generate signed URL');
    //     }
    // }

    // async deleteFile(key: string): Promise<{ message: string }> {
    //     if (!key) {
    //         throw new BadRequestException('File key is required');
    //     }

    //     try {
    //         const command = new DeleteObjectCommand({
    //             Bucket: this.bucket,
    //             Key: key,
    //         });

    //         await this.client.send(command);
    //         return { message: 'File deleted successfully' };
    //     } catch (error) {
    //         throw new InternalServerErrorException('Failed to delete file');
    //     }
    // }
}
