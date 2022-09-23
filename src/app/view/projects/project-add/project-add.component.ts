import { DOCUMENT } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Inject, Input, OnChanges, OnInit, Output, Renderer2, SimpleChanges } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { NgOption } from '@ng-select/ng-select';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subscriber } from 'rxjs';
import { AwsService } from 'src/app/services/aws.service';
import { FormValidationService } from 'src/app/shared/form-validation.service';
import { statusList } from 'src/app/shared/project-status.list';
import { ProjectsViewMode } from 'src/app/shared/router-interaction-types';
import { AppSessionStorageService } from 'src/app/shared/session-storage.service';
import { project_add } from 'src/app/shared/toast-message-text';
import { AppUser } from '../../auth-register/auth-register.model';
import { ClientsService } from '../../clients/clients.service';
import { UserService } from '../../users/user.service';
import { ProjectService } from '../project.service';
declare var $: any;
declare const google;
@Component({
  selector: 'app-project-add',
  templateUrl: './project-add.component.html',
  styleUrls: ['./project-add.component.scss','../../../../assets/css/app.css',
  '../../../../assets/css/icons.css']
})

export class ProjectAddComponent implements OnInit, AfterViewInit, OnChanges {

  @Output() addSuccessEvent = new EventEmitter<string>();

  formSubmitAttempt: boolean = false;
  projectForm: FormGroup;
  errorMsg = '';
  isLoading = false;
  incomeDescription: string;
  incomeAmount: string;
  incomeType: string;
  isSaving = false;
  imageProp: any;
  clientList:any=[];
  DesignerList:any=[];
  startDate:any;
  deadLine:any;
  currentUser:AppUser;
  readonly statusList: NgOption[] = statusList;
  imageData:any;
  @Input()
  projectsViewMode:ProjectsViewMode = 'project-mode';
  constructor(private userService : UserService, private appSessionStorageService: AppSessionStorageService,private renderer2: Renderer2, @Inject(DOCUMENT) private document: Document, private _awsService: AwsService, private _formValidationService: FormValidationService, private _formbuilder: FormBuilder,
    private toastr: ToastrService, private cdRef: ChangeDetectorRef, private _projectService: ProjectService,private _clientService : ClientsService) {
    this.incomeType = null;
    if (this.appSessionStorageService.getCurrentUser() != null) {
      this.currentUser = JSON.parse(this.appSessionStorageService.getCurrentUser()) as AppUser;
    }
  }
  ngOnChanges(): void {
    if(!this.projectForm?.controls)
      return;
    (this.projectForm.controls.hasInventory as FormControl)
      .setValue(this.projectsViewMode === 'inventory-mode');
    (this.projectForm.controls.isInventory as FormControl)
      .setValue(this.projectsViewMode === 'inventory-mode');
  }

  ngOnInit(): void {
    console.log('project add init')
    this.projectForm = this._formbuilder.group({
      ProjectName: ['', Validators.compose([Validators.required])],
      clientId: ['', Validators.compose([Validators.required])],
      StartDate: ['', Validators.compose([Validators.required])],
      Deadline: [''],
      Cost: [''],
      Status: [''],
      IsSendMail:[false],
      ProjectTypeIds : [''],
      SquareFootage : [''],
      Beds : [''],
      Baths : [''],
      Garage : [''],
      GarageType : [''],
      Floors : [''],
      HeatedSquareFootage : [''],
      FrontPatio : ['false'],
      Deck : ['false'],
      hasInventory: [this.projectsViewMode === 'inventory-mode'],
      isInventory: [this.projectsViewMode === 'inventory-mode']
    });
    
    this.getClients();
    this.getDesigner();
  }

  getClients(){
    this.userService.GetUserByRole("Client").subscribe(res=>{
      this.clientList = res;
    })
  }

  getDesigner(){
    this.userService.GetUserByRole("Designer").subscribe(res=>{
      this.DesignerList = res;
      if ($('.select2').length) {
        $('.select2').select2();
      }
    })
  }

  HasValidationError(key, keyError) {
    return this._formValidationService.HasError(this.projectForm, key, keyError, this.formSubmitAttempt);
  }

  ngAfterViewInit() {
    this.reset();
    this.cdRef.detectChanges();
  }

  onSubmit(model, isValid) {
    this.formSubmitAttempt = true;
    if (!isValid)
      return false;
    const DesignerIds = [];
    const members = document.getElementById('add-designer');
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
    const projectTypeMember = document.getElementById('ProjectType');
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
    this._projectService.SaveProject(model).subscribe(res => {
      this.isSaving = false;
      this.formSubmitAttempt = false;
      this.addSuccessEvent.emit("value");
      this.toastr.info(project_add.add_project_success);
      this.close(null);
    }, error => {
      this.isSaving = false;
      this.formSubmitAttempt = false;
      this.toastr.info(project_add.add_project_error);
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
    $('#addproject').modal('toggle');

  }

  public onReturnData(data: any) {
    const croppedImage = JSON.parse(data);
    this.imageProp = {
      image: croppedImage.image,
      imageName: croppedImage.filename
    };
    this.imageData = croppedImage.image;
  }

  removeWebsiteLogo() {
    this.imageData = null;
  }

  initAutocomplete() {

    const input = document.getElementById("txtSearchPlaces") as HTMLInputElement;
    const autocomplete = new google.maps.places.Autocomplete(input);
    autocomplete.setFields([
      "address_components",
      "geometry",
      "icon",
      "name"
    ]);
    const infowindow = new google.maps.InfoWindow();
    const infowindowContent = this.document.getElementById("infowindow-content") as HTMLInputElement;
    infowindow.setContent(infowindowContent);
    
    autocomplete.addListener("place_changed", () => {
      infowindow.close();
      const place = autocomplete.getPlace();
      if (!place.geometry) {
        // User entered the name of a Place that was not suggested and
        // pressed the Enter key, or the Place Details request failed.
        alert('No details available for input:' + input.value);
        return;
      }

      let address = "";
      if (place.address_components) {
        address = [
          (place.address_components[0] &&
            place.address_components[0].short_name) ||
          "",
          (place.address_components[1] &&
            place.address_components[1].short_name) ||
          "",
          (place.address_components[2] &&
            place.address_components[2].short_name) ||
          "",
          (place.address_components[3] &&
            place.address_components[3].short_name) ||
          "",
          (place.address_components[4] &&
            place.address_components[4].short_name) ||
          "",
          (place.address_components[5] &&
            place.address_components[5].short_name) ||
          "",
          (place.address_components[6] &&
            place.address_components[6].short_name) ||
          ""
        ].join(" ");
      }
      (this.projectForm.controls.CompanyAdress as FormControl)
      .setValue(address);
      
    });
  }

  onChangeData(val){
  }
  // store the date of birth in the formControl object and clear its validator
  setDob(date) {
    (this.projectForm.controls.StartDate as FormControl)
      .setValue(date);
    this.projectForm.get('StartDate').clearValidators();
  }
  setDeadline(date){
    (this.projectForm.controls.StartDate as FormControl)
      .setValue(date);
    this.projectForm.get('Deadline').clearValidators();
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

  public get labels() {
    if(this.projectsViewMode === 'project-mode') return {
      header: 'Add Project',
      name: 'Project Name',
      type: 'Project Type',
      hasInventory: 'Add to Inventory'
    }
    else return {
      header: 'Add to Inventory',
      name: 'Name',
      type: 'Type',
      hasInventory: 'Add to Projects'
    }
  }
  

}