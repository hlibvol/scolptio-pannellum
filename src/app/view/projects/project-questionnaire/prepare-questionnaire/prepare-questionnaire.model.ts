import { Room } from "../room.model";
import { Question } from "../question.model";
import { DomSanitizer } from "@angular/platform-browser";
import { S3File, S3FileImpl } from "src/app/shared/models/s3-items-model";

export class PrepareQuestionnaire {
    private _selectedRoomIndex: number = -1;
    public projectId: string = '';
    public roomName: string = '';
    public selectedRoom: Room = null;
    public rooms: Room[] = [];
    public newQuestion: string = '';
    public isDirty: boolean = false;
    public get selectedRoomIndex(): number{
      return this._selectedRoomIndex;
    }
    public get roomCount(): number{
      return this.rooms?.filter(x => !x.isFloorPlan).length as number;
    }
    constructor(private sanitizer: DomSanitizer) { }
    addNewRoom(isFloorPlan: boolean): void {
      var roomName = '';
      if(isFloorPlan)
        roomName = 'Floor Plan';
      else if(!this.roomName.length)
        return;
      else
        roomName = this.roomName;
      var room:Room = new Room;
      room.name = roomName;
      room.isFloorPlan = isFloorPlan;
      if(this.rooms?.length)
        this.rooms.push(room);
      else
        this.rooms = [room];
      this.roomName = '';
      this.selectRoomAtIndex(this.rooms.length - 1)
    }
    addQuestionToRoom(): void {
      if(!this.selectedRoom || !this.newQuestion)
        return;
      if(!this.selectedRoom.questions?.length){
        this.selectedRoom.questions = [{
          interrogative: this.newQuestion
        } as Question]
      }
      else
        this.selectedRoom.questions.push({
          interrogative: this.newQuestion
        } as Question)
      this.newQuestion = '';
      this.isDirty = true;
    }
    selectRoomAtIndex(index: number): void {
      this.selectedRoom = Object.assign({}, this.rooms[index]);
      this._selectedRoomIndex = index;
      this.isDirty = false;
    }
    saveRoom(updatedRoom): void {
      this.selectedRoom = updatedRoom;
      this.rooms[this._selectedRoomIndex] = Object.assign({}, this.selectedRoom);
      this.isDirty = false;
    }
    deleteQuestionFromRoomAtIndex(index: number) {
      this.selectedRoom.questions.splice(index, 1);
      this.isDirty = true;
    }
    getIdOfRoomAtIndex(index: number): string {
      return this.rooms[index].id;
    }
    deleteRoomAtIndex(index: number): void {
      if(index === this._selectedRoomIndex){
        this._selectedRoomIndex = -1
        this.selectedRoom = null;
      }
      if(index < this._selectedRoomIndex)
        this.selectRoomAtIndex(--this._selectedRoomIndex);
      this.rooms.splice(index, 1);
    }
    addImageToSelectedRoom(file: File): void {
      if(!this.selectedRoom)
        return;
      var s3File = new S3FileImpl('', this.sanitizer.bypassSecurityTrustUrl(window.URL.createObjectURL(file)), file)
      this.newFileUploaded(s3File)
      this.isDirty = true;
    }
    newFileUploaded(image: S3File): void {
      if(this.selectedRoom.images)
        this.selectedRoom.images.push(image);
      else
        this.selectedRoom.images = [image];
    }
    sanitizeImageAndAdd(i: number, url: string): void {
      this.selectedRoom.images[i].safeUrl = this.sanitizer.bypassSecurityTrustUrl(url);
    }
    deleteImageAtIndex(i: number): void {
      this.selectedRoom.images.splice(i, 1);
    }
}