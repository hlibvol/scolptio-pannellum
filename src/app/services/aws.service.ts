import { Injectable, Injector } from '@angular/core';
import { DeleteObjectCommand, GetObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { BaseService } from '../shared/base.service';
import { S3File } from '../shared/shared.model';
import { FileUpload } from '../view/properties/properties.model';
import { ConfigsLoaderService } from './configs-loader.service';
import { v4 as uuidv4 } from 'uuid';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
@Injectable({
  providedIn: 'root'
})
export class AwsService extends BaseService {

  constructor(_injector: Injector) {
    super(_injector);
  }


  public uploadImages(imgFile: S3File) {

    const extension = (/[.]/.exec(imgFile.file.name)) ? /[^.]+$/.exec(imgFile.file.name)[0] : undefined;
    const uuid = uuidv4();
    const imageFileName = uuid + '.' + extension;

    const client = new S3Client({
      credentials: {
        accessKeyId: "AKIAQ7DY7O7IM4XWIN5I",
        secretAccessKey: "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"
      },
      region: "us-east-2"
    });

    debugger;
    const params = {
      Bucket: "ph-saas-bucket-us-east-2",
      Key: imageFileName,
      Body: imgFile.file
    };

    const command = new PutObjectCommand(params);
    //this.isSaving++;
    imgFile.status = 'uploading';
    return client.send(command).then(
      (data) => {
        //this.isSaving--;
        imgFile.status = 'success';
        const imageUrl = `https://${this._configLoaderService.bucket}.s3.${this._configLoaderService.region}.amazonaws.com/${imageFileName}`;

        const imageUpload = new FileUpload();
        imageUpload.fileName = imgFile.file.name;
        imageUpload.fileKey = imageFileName;
        imageUpload.extension = extension;
        imageUpload.fileSize = imgFile.file.size.toString();
        imageUpload.url = imageUrl;
        return imageUpload;
        //this.fileUploads.push(imageUpload);
        //this.hasSucces = true;
      },
      (error) => {
        // error handling.
        //this.isSaving--;
        imgFile.status = 'error';
      }
    );
  }

  public DeleteImage(key) {
    const client = new S3Client({
      credentials: {
        accessKeyId: "AKIAQ7DY7O7IM4XWIN5I",
        secretAccessKey: "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"
      },
      region: "us-east-2"
    });

    const params = {
      Bucket: "ph-saas-bucket-us-east-2",
      Key: key,
    };

    const command = new DeleteObjectCommand(params);
    return client.send(command).then(
      (data) => {
      });
  }

  public GetUrl = async (key: string): Promise<string> => {
    let url: string;
    if (key) {
      const client = new S3Client({
        credentials: {
          accessKeyId: "AKIAQ7DY7O7IM4XWIN5I",
          secretAccessKey: "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"
        },
        region: "us-east-2"
      });

      const params = {
        Bucket: "ph-saas-bucket-us-east-2",
        Key: key,
      };
      url = await getSignedUrl(client, new GetObjectCommand(params), { expiresIn: 3600 });

    }

    return url;
  }

}
