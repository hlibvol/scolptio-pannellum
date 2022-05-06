import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SafeUrlService } from 'src/app/shared/safe-url.service';
import { common_error_message } from 'src/app/shared/toast-message-text';
import { ProjectService } from '../../project.service';
import { Question } from '../question.model';
import { Room, S3File } from '../room.model';
import { FillQuestionnaire } from './fill-questionnaire.model';

@Component({
  selector: 'app-fill-questionnaire',
  templateUrl: './fill-questionnaire.component.html',
  styleUrls: ['./fill-questionnaire.component.scss',
  '../../../../../assets/css/app.css',
  '../../../../../assets/css/icons.css']
})
export class FillQuestionnaireComponent implements OnInit {

  @ViewChild('uploadImage')
  uploadImage: ElementRef;
  isLoading: boolean = false;
  public fillQuestionnaire: FillQuestionnaire;
  constructor(private projectService: ProjectService,
    private toastrService: ToastrService,
    private sanitizer: DomSanitizer,
    private route: ActivatedRoute,
    private safeUrlService: SafeUrlService) { 
      this.fillQuestionnaire = new FillQuestionnaire(this.sanitizer);
      this.route.params.subscribe(params => {
        this.fillQuestionnaire.projectId = params['id'];
      })
    }

  async ngOnInit(): Promise<void> {
    this.isLoading = true;
    await this.loadRooms();
    if(this.fillQuestionnaire.rooms)
      await this.selectRoomAtIndex(0);
    this.isLoading = false;
  }
  async selectRoomAtIndex(i: number): Promise<void> {
    try{
      this.isLoading = true;
      var room: Room = await this.projectService.roomDetailsById(this.fillQuestionnaire.rooms[i].id).toPromise();
      this.fillQuestionnaire.selectRoomAtIndex(i, room);
    }
    catch{
      this.toastrService.error(common_error_message);
    }
    finally{
      this.isLoading = false;
    }
  }
  async loadRooms(): Promise<void> {
    this.fillQuestionnaire.rooms = await this.projectService.roomList(this.fillQuestionnaire.projectId).toPromise();
  }
  uploadImageClick(): void {
    this.uploadImage.nativeElement.click();
  }
  filesAdded(): void {
    var files: File[] = this.uploadImage.nativeElement.files;
    this.fillQuestionnaire.attachmentsAdded(files)
  }
  setIsDirty(): void {
    this.fillQuestionnaire.isDirty = true;
  }
  async saveQuestion(): Promise<void> {
    try{
      this.isLoading = true;
      let question:Question = this.fillQuestionnaire.getActiveQuestion()
      for(let i in question.attachments) {
        var attachment = question.attachments[i]
        if(!attachment.s3Key && attachment.file){
          let formData = new FormData();
          formData.append('FileData', attachment.file)
          let uploadResult: S3File = await this.projectService.uploadToS3(formData).toPromise();
          this.fillQuestionnaire.updateAttachmentAtIndex(parseInt(i), uploadResult);
        }
      }
      await this.projectService.saveQuestion(question).toPromise();
      this.fillQuestionnaire.checkCompleted();
      this.toastrService.success('Answer saved')
      this.openNextQuestion();
    }
    catch{
      this.toastrService.error(common_error_message)
    }
    finally{
      this.isLoading = false;
    }
  }
  async openQuestionAtIndex(i: number): Promise<void> {
    try{
      if(this.fillQuestionnaire.isDirty)
        await this.saveQuestion();
      this.fillQuestionnaire.openQuestionAtIndex(i);
    }
    catch{
      this.toastrService.error(common_error_message)
    }
    finally{
      this.isLoading = false;
    }
  }
  async openNextQuestion(): Promise<void> {
    if(this.fillQuestionnaire.selectedQuestionIndex < this.fillQuestionnaire.selectedRoom.questions.length - 1)
      this.fillQuestionnaire.openQuestionAtIndex(this.fillQuestionnaire.selectedQuestionIndex + 1);
    else if(this.fillQuestionnaire.selectedRoomIndex < this.fillQuestionnaire.rooms.length - 1)
      await this.selectRoomAtIndex(this.fillQuestionnaire.selectedRoomIndex + 1)
    else{
      let index = this.fillQuestionnaire.rooms.findIndex(x => !x.isCompleted);
      if(index !== -1)
        await this.selectRoomAtIndex(index);
      else
        this.toastrService.info('Questionnaire completed successfully')
    }
  }
  openAttachment(attachment: S3File): void {
    this.safeUrlService.open(attachment.safeUrl);
  }
  removeAttachmentAtIndex(i: number): void {
    this.fillQuestionnaire.removeActiveAttachmentAtIndex(i);
  }
}
