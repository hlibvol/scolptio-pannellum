import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { common_error_message } from 'src/app/shared/toast-message-text';
import { ProjectService } from '../../project.service';
import { PrepareQuestionnaire } from './prepare-questionnaire.model';
import { Room, S3File } from './room.model';

@Component({
  selector: 'app-prepare-questionnaire',
  templateUrl: './prepare-questionnaire.component.html',
  styleUrls: ['./prepare-questionnaire.component.scss', 
    '../../../../../assets/css/app.css',
    '../../../../../assets/css/icons.css']
})
export class PrepareQuestionnaireComponent implements OnInit {
  
  @ViewChild('imageAdd') 
  imageAdd: ElementRef;
  isLoading:boolean = false;
  prepareQuestionnaire: PrepareQuestionnaire;
  constructor(private projectService: ProjectService,
    private toastr: ToastrService,
    private activatedRoute: ActivatedRoute,
    private sanitizer: DomSanitizer) { 

    this.prepareQuestionnaire = new PrepareQuestionnaire(this.sanitizer);
    this.activatedRoute.params.subscribe(async (params) => {
      if (params['id'])
        this.prepareQuestionnaire.projectId = params['id'];
        else
        this.toastr.error('Something went wrong. Please try again later.');
    });

  }

  async ngOnInit(): Promise<void> {
    try{
      this.isLoading = true;
      this.prepareQuestionnaire.rooms = await this.projectService.prepareQuestionnaire(this.prepareQuestionnaire.projectId).toPromise();
      if(this.prepareQuestionnaire.rooms?.length)
        this.selectRoomAtIndex(0);
    }
    catch{
      this.toastr.error(common_error_message)
    }
    finally{
      this.isLoading = false;
    }
    
  }

  async addRoom(isFloorPlan: boolean = false): Promise<void> {
    if(this.prepareQuestionnaire.selectedRoom && this.prepareQuestionnaire.isDirty)
      await this.saveRoom();
    this.prepareQuestionnaire.addNewRoom(isFloorPlan);
    await this.saveRoom();
    // The above is NOT two reduntant saveRoom() calls - this.prepareQuestionnaire.selectedRoom is different between the two calls
  }
  addQuestionToRoom(): void {
    this.prepareQuestionnaire.addQuestionToRoom();
  }
  async selectRoomAtIndex(index: number): Promise<void> {
    this.prepareQuestionnaire.selectRoomAtIndex(index);
    await this.loadImages();
  }
  async loadImages(): Promise<void> {
    for(let i in this.prepareQuestionnaire.selectedRoom.images){
      let item = this.prepareQuestionnaire.selectedRoom.images[i];
      if(item.s3Key){
        var url = await this.projectService.getS3ObjectUrl(item.s3Key).toPromise();
        this.prepareQuestionnaire.sanitizeImageAndAdd(parseInt(i), url)
      }
      else
        this.prepareQuestionnaire.selectedRoom.images.splice(parseInt(i), 1);
    }
      
  }
  async saveRoom(): Promise<void> {
    try{
      this.isLoading = true;
      for(let i in this.prepareQuestionnaire.selectedRoom.images){
        let item = this.prepareQuestionnaire.selectedRoom.images[i];
        if(item.s3Key)
          continue;
        var formData:FormData = new FormData;
        formData.append('FileData', item.file);
        this.prepareQuestionnaire.selectedRoom.images[i] = await this.projectService.uploadToS3(formData).toPromise();
      }
      this.prepareQuestionnaire.selectedRoom.images = this.prepareQuestionnaire.selectedRoom.images.filter(x => x.s3Key)
      var updatedRoom: Room = await this.projectService.saveRoom(this.prepareQuestionnaire.projectId, this.prepareQuestionnaire.selectedRoom).toPromise();
      this.prepareQuestionnaire.saveRoom(updatedRoom);
      await this.loadImages();
      this.toastr.success('Room saved');
    }
    catch{
      this.toastr.error(common_error_message);
    }
    finally{
      this.isLoading = false;
    }
  }
  deleteQuestionFromRoomAtIndex(index: number): void {
    this.prepareQuestionnaire.deleteQuestionFromRoomAtIndex(index);
  }
  async deleteRoomAtIndex(index: number): Promise<void> {
    try{
      this.isLoading = true;
      var roomId: string = this.prepareQuestionnaire.getIdOfRoomAtIndex(index);
      await this.projectService.deleteRoomById(roomId).toPromise();
      this.prepareQuestionnaire.deleteRoomAtIndex(index);
      this.toastr.success('Room deleted');
    }
    catch{
      this.toastr.error(common_error_message);
    }
    finally{
      this.isLoading = false;
    }
  }
  onImageAdd(): void {
    var file:File = this.imageAdd.nativeElement.files[0];
    this.prepareQuestionnaire.addImageToSelectedRoom(file);
  }
  uploadClick(): void {
    if(this.prepareQuestionnaire.selectedRoom)
      this.imageAdd.nativeElement.click()
  }
  deleteImageAtIndex(i: number): void {
    this.prepareQuestionnaire.deleteImageAtIndex(i);
  }
}
