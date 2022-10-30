import { DOCUMENT, formatDate } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Inject, Input, OnChanges, OnInit, Output, Renderer2, SimpleChanges } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { NgOption } from '@ng-select/ng-select';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subscriber } from 'rxjs';
import { AwsService } from 'src/app/services/aws.service';
import { FormValidationService } from 'src/app/shared/form-validation.service';
import { statusList } from 'src/app/shared/project-status.list';
import { ProjectsViewMode } from 'src/app/shared/router-interaction-types';
import { project_edit } from 'src/app/shared/toast-message-text';
import { ClientsService } from '../../clients/clients.service';
import { UserService } from '../../users/user.service';
import { ProjectService } from '../project.service';
declare var $: any;
@Component({
  selector: 'app-project-edit',
  templateUrl: './project-edit.component.html',
  styleUrls: ['./project-edit.component.scss', '../../../../assets/css/app.css',
    '../../../../assets/css/icons.css']
})

export class ProjectEditComponent implements OnInit, AfterViewInit, OnChanges {

  @Input() project: any;
  @Output() updateSuccessEvent = new EventEmitter<string>();

  formSubmitAttempt: boolean = false;
  projectForm: FormGroup;
  errorMsg = '';
  isLoading = false;
  incomeDescription: string;
  incomeAmount: string;
  incomeType: string;
  isSaving = false;
  imageProp: any;
  clientList: any = [];
  DesignerList: any = [];
  readonly statusList: NgOption[] = statusList;
  imageData:any;
  @Input()
  projectsViewMode:ProjectsViewMode = 'project-list';
  constructor(private userService: UserService, private _clientService: ClientsService, private renderer2: Renderer2, @Inject(DOCUMENT) private document: Document, private _awsService: AwsService, private _formValidationService: FormValidationService, private _formbuilder: FormBuilder,
    private toastr: ToastrService, private cdRef: ChangeDetectorRef, private projectService: ProjectService) {
    this.incomeType = null;
  }

  ngOnInit(): void {
    this.statusList.unshift({
      value: '',
      label: 'Select Status'
    })
    this.getClients();
    this.getDesigner();
  }

  getClients() {
    this.userService.GetUserByRole("Client").subscribe(res => {
      this.clientList = res;
    })
  }

  getDesigner() {
    this.userService.GetUserByRole("Designer").subscribe(res => {
      this.DesignerList = res;

      if ($('.select2').length) {
        $('.select2').select2();
      }
    })
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.projectForm) {
      this.projectForm.reset();
    }
    if (this.project) {
      this.projectForm = this._formbuilder.group({
        Id: [''],
        ProjectName: ['', Validators.compose([Validators.required])],
        clientId: ['', Validators.compose([Validators.required])],
        StartDate: [formatDate(this.project.startDate, 'yyyy-MM-dd', 'en'), [Validators.required]],
        Deadline: [formatDate(this.project.deadline, 'yyyy-MM-dd', 'en')],
        Cost: [''],
        Status: [''],
        IsSendMail: [false],
        SquareFootage: [''],
        Beds: [''],
        Baths: [''],
        Garage: [''],
        GarageType: [''],
        Floors: [''],
        HeatedSquareFootage: [''],
        FrontPatio: [''],
        Deck: [''],
        hasInventory: [this.projectsViewMode === 'inventory'],
        isInventory: [this.projectsViewMode === 'inventory']
      });
      this.formData();
    }
  }
  formData() {
    if (!this.project) return;
    (this.projectForm.controls.Id as FormControl)
      .setValue(this.project.id);
    (this.projectForm.controls.ProjectName as FormControl)
      .setValue(this.project.projectName);
    (this.projectForm.controls.clientId as FormControl)
      .setValue(this.project.clientId);
    (this.projectForm.controls.Cost as FormControl)
      .setValue(this.project.cost);
    (this.projectForm.controls.Status as FormControl)
      .setValue(this.project.status);
    (this.projectForm.controls.SquareFootage as FormControl)
      .setValue(this.project.squareFootage);
      (this.projectForm.controls.HeatedSquareFootage as FormControl)
      .setValue(this.project.heatedSquareFootage);
    debugger;
    (this.projectForm.controls.Beds as FormControl)
      .setValue(this.project.beds);
    (this.projectForm.controls.Baths as FormControl)
      .setValue(this.project.baths);
    (this.projectForm.controls.Garage as FormControl)
      .setValue(this.project.garage);
    (this.projectForm.controls.GarageType as FormControl)
      .setValue(this.project.garageType);
    (this.projectForm.controls.Floors as FormControl)
      .setValue(this.project.floors);
      (this.projectForm.controls.FrontPatio as FormControl)
      .setValue(this.project.frontPatio);
      (this.projectForm.controls.Deck as FormControl)
      .setValue(this.project.deck);
      this.imageData = this.project.featuredImage;
    (this.projectForm.controls.hasInventory as FormControl)
      .setValue(this.project.hasInventory);
    (this.projectForm.controls.isInventory as FormControl)
      .setValue(this.project.isInventory);
    this.prepareMemberData();

  }

  prepareMemberData() {
    setTimeout(() => {
      debugger
      if (this.project?.designers?.length) {
        const role = document.getElementById('user-role-edit');
        if (role) {
          const options = role['options'];
          if (options && options.length > 0) {
            for (let i = 0; i < options.length; i++) {
              const isExist = this.project.designers.find((x: any) => x.id === options[i].value);
              if (isExist) {
                $('#user-role-edit')[0]['options'][i].selected = true;
              } else {
                $('#user-role-edit')[0]['options'][i].selected = false;
              }
            }
          }
        }
      }

      if (this.project && this.project.projectTypeIds != null && this.project.projectTypeIds.length > 0) {
        const role = document.getElementById('ProjectType-edit');
        if (role) {
          const options = role['options'];
          if (options && options.length > 0) {
            for (let i = 0; i < options.length; i++) {
              const isExist = this.project.projectTypeIds.find((x: any) => x === options[i].value);
              if (isExist) {
                $('#ProjectType-edit')[0]['options'][i].selected = true;
              } else {
                $('#ProjectType-edit')[0]['options'][i].selected = false;
              }
            }
          }
        }
      }

      if ($('.select2').length) {
        $('.select2').select2();
      }
    }, 1000);

  }

  HasValidationError(key, keyError) {
    if(this.projectsViewMode === 'inventory' && !this.projectForm.value.hasInventory)
      return false;
    return this._formValidationService.HasError(this.projectForm, key, keyError, this.formSubmitAttempt);
  }

  ngAfterViewInit() {
    this.reset();
    this.cdRef.detectChanges();
  }

  onSubmit(model, isValid) {
    this.formSubmitAttempt = true;
    if (!isValid && (this.projectsViewMode === 'project-list'|| this.projectForm.value.hasInventory))
      return false;
    const DesignerIds = [];
    const members = document.getElementById('user-role-edit');
    if (members != null) {
      const options = members['options'];
      if (options && options.length > 0) {
        for (const option of options) {
          if (option.selected) {
            DesignerIds.push(option.value);
          }
        }
      }
    }

    const projectTypeIds = [];
    const projectTypeMember = document.getElementById('ProjectType-edit');
    if (projectTypeMember != null) {
      const options = projectTypeMember['options'];
      if (options && options.length > 0) {
        for (const option of options) {
          if (option.selected) {
            projectTypeIds.push(option.value);
          }
        }
      }
    }

    this.isSaving = true;
    model.DesignerIds = DesignerIds;
    model.ProjectTypeIds = projectTypeIds;
    model.FeaturedImage = this.imageData;
    if(model.hasInventory)
      model.isInventory = true;
    this.projectService.UpdateProject(model).subscribe(res => {
      this.isSaving = false;
      this.formSubmitAttempt = false;
      this.updateSuccessEvent.emit("value");
      this.toastr.info(project_edit.edit_project_success);
      this.close(null);
    }, error => {
      this.isSaving = false;
      this.formSubmitAttempt = false;
      this.toastr.info(project_edit.edit_project_error);
    })
  }

  public async dataUrlToFile(dataUrl: string, fileName: string): Promise<File> {

    const res: Response = await fetch(dataUrl);
    const blob: Blob = await res.blob();
    return new File([blob], fileName, { type: 'image/png' });
  }

  reset() {
    this.incomeDescription = "";
    this.incomeAmount = "";
    this.incomeType = "";
  }

  close(form: any) {
    this.projectForm.reset();
    $('#editproject').modal('toggle');

  }

  onChangeData(val) {
  }

  onChangeImg($event: Event) {
    this.isSaving = true;
    const file = ($event.target as HTMLInputElement).files[0];
    this.convertToBase64(file);
  }

  convertToBase64(file: File) {
    const observable = new Observable((subscriber: Subscriber<any>) => {
      this.readFile(file, subscriber);
    });
    observable.subscribe((data) => {
      this.imageData = data;
      this.isSaving = false;
    });
  }

  readFile(file: File, subscriber: Subscriber<any>) {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);

    fileReader.onload = () => {
      subscriber.next(fileReader.result);
      subscriber.complete();
    }

    fileReader.onerror = (error) => {
      subscriber.error(error);
      subscriber.complete();
    }
    
  }
  removeImage() {
    this.imageData = null;
  }
  public onReturnData(data: any) {
    const croppedImage = JSON.parse(data);
    this.imageProp = {
      image: croppedImage.image,
      imageName: croppedImage.filename
    };
    this.imageData = croppedImage.image;
  }

  public get labels() {
    if(this.projectsViewMode === 'project-list') return {
      header: 'Edit Project',
      name: 'Project Name',
      type: 'Project Type',
      hasInventory: 'Added to Inventory'
    }
    else return {
      header: 'Edit Inventory Item',
      name: 'Name',
      type: 'Type',
      hasInventory: 'Added to Projects'
    }
  }
}