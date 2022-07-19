import { DomSanitizer, SafeUrl } from "@angular/platform-browser";
import { S3File, S3FileImpl } from "src/app/shared/models/s3-items-model";
import { Question } from "../question.model";
import { Room } from "../room.model";

export class FillQuestionnaire{
    private _selectedRoomIndex: number = -1;
    private _selectedQuestionIndex: number = -1;
    public projectId: string = '';
    public selectedRoom: Room<Question> = null;
    public rooms: Room<Question>[] = [];
    public isDirty: boolean = false;
    public get selectedRoomIndex(): number{
      return this._selectedRoomIndex;
    }
    public get selectedQuestionIndex(): number{
        return this._selectedQuestionIndex;
    }
    constructor(private sanitizer: DomSanitizer) { }
    selectRoomAtIndex(i: number, room: Room<Question>) {
        this.selectedRoom = Object.assign({}, room);
        this._selectedRoomIndex = i;
        this._selectedQuestionIndex = 0;
        this.isDirty = false;
        this.checkCompleted();
    }
    attachmentsAdded(files: File[]) {
        let s3Files: S3File[] = [];
        for(let file of files)
        {
            let url: SafeUrl = this.sanitizer.bypassSecurityTrustUrl(window.URL.createObjectURL(file));
            s3Files.push(new S3FileImpl('', url, file));
        }
        this.selectedRoom.questions[this._selectedQuestionIndex].attachments = s3Files;
        this.isDirty = true;
    }
    getActiveQuestion(): Question {
        return this.selectedRoom.questions[this._selectedQuestionIndex];
    }
    checkCompleted(): void {
        this.rooms[this._selectedRoomIndex].isCompleted = this.selectedRoom.questions.filter(x => !x.answer).length === 0;
    }
    openQuestionAtIndex(i: number): void {
        this._selectedQuestionIndex = i;
    }
    updateAttachmentAtIndex(i: number, attachment: S3File): void {
        this.selectedRoom.questions[this._selectedQuestionIndex].attachments[i] = attachment;
    }
    removeActiveAttachmentAtIndex(i: number) {
        this.getActiveQuestion().attachments.splice(i, 1);
    }
}