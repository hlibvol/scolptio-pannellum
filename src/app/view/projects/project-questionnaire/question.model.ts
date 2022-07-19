import { S3File } from "src/app/shared/models/s3-items-model";

export class Question{
    public id: string = '';
    public interrogative: string = '';
    public answer: string = '';
    public attachments: S3File[] = [];
}

export class PrepareQuestion extends Question{
    public isEditMode: boolean = false;
    public editInterrogative: string = '';
}