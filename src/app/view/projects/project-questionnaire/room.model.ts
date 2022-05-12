
import { S3File } from "src/app/shared/models/s3-items-model";
import { BaseRoom } from "./base-room.model";
import { Question } from "./question.model";

export class Room extends BaseRoom{
    public images: S3File[] = [];
    public questions: Question[] = [];
    public isCompleted: boolean;
}