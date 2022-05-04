import { S3File } from "./room.model";

export class Question{
    public id: string = '';
    public interrogative: string = '';
    public answer: string = '';
    public attachments: S3File[] = [];
}