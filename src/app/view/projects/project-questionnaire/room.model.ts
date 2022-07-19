
import { S3File } from "src/app/shared/models/s3-items-model";
import { BaseRoom } from "./base-room.model";
import { Question } from "./question.model";

export class Room<T extends Question> extends BaseRoom{
    public images: S3File[] = [];
    public questions: T[] = [];
    public isCompleted: boolean;
}