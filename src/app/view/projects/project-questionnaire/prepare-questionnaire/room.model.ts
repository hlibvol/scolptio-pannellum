import { SafeUrl } from "@angular/platform-browser";
import { Question } from "./question.model";

export class Room{
    public id: string = '';
    public name: string = '';
    public isFloorPlan: boolean = false;
    public images: S3File[] = [];
    public questions: Question[] = [];
}

export class S3File{
    public s3Key: string;
    public safeUrl: SafeUrl;
    public file: File;
    constructor(s3Key: string, safeUrl: SafeUrl, file: File){
        this.s3Key = s3Key;
        this.safeUrl = safeUrl;
        this.file = file;
    }
}