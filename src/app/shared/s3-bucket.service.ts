import { Injectable, Injector } from '@angular/core';
import { BaseService } from './base.service';

const { S3Client, GetObjectCommand } = require("@aws-sdk/client-s3");
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { DeleteObjectCommand, DeleteObjectCommandInput, S3 } from '@aws-sdk/client-s3';
import { param } from 'jquery';
@Injectable()
export class S3BucketService extends BaseService {

  constructor(_injector: Injector) {
    super(_injector);
  }

  public GetUrl = async (key: string): Promise<string> => {
    let url: string;
    if (key) {
      const client = new S3Client({
        credentials: {
          accessKeyId: "AKIAYRELZPYTB44GTA42",
          secretAccessKey: "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"
        },
        region: "us-east-2"
      });

      const params = {
        Bucket: "scolptio-crm-bucket",
        Key: key,
      };
      url = await getSignedUrl(client, new GetObjectCommand(params), { expiresIn: 3600 });

    }

    return url;
  }

  public async deleteObj(key): Promise<boolean> {
    const client = new S3Client({
      credentials: {
        accessKeyId: "AKIAYRELZPYTB44GTA42",
        secretAccessKey: "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"
      },
      region: "us-east-2"
    });

    const params = {
      Bucket: "scolptio-crm-bucket",
      Key: key,
    };

    const command = new DeleteObjectCommand(params);
    client.send(command).then(res=>{
      console.log("deleted")
    })

    return true;
  }
}
