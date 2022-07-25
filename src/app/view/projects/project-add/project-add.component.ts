import { DOCUMENT } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Inject, Input, OnInit, Output, Renderer2 } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { NgOption } from '@ng-select/ng-select';
import { ToastrService } from 'ngx-toastr';
import { AwsService } from 'src/app/services/aws.service';
import { FormValidationService } from 'src/app/shared/form-validation.service';
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

export class ProjectAddComponent implements OnInit, AfterViewInit {

  @Output() addSuccessEvent = new EventEmitter<string>();

  formSubmitAttempt: boolean = false;
  projectForm: FormGroup;
  errorMsg = '';
  isLoading = false;
  incomeDescription: string;
  incomeAmount: string;
  incomeType: string;
  isSaving = false;
  websiteLogoImage: any = "../../../assets/img/weblogo.png";
  imageProp: any;
  clientList:any=[];
  DesignerList:any=[];
  startDate:any;
  deadLine:any;
  currentUser:AppUser;
  @Input()
  statusList: NgOption[] = [];
  constructor(private userService : UserService, private appSessionStorageService: AppSessionStorageService,private renderer2: Renderer2, @Inject(DOCUMENT) private document: Document, private _awsService: AwsService, private _formValidationService: FormValidationService, private _formbuilder: FormBuilder,
    private toastr: ToastrService, private cdRef: ChangeDetectorRef, private _projectService: ProjectService,private _clientService : ClientsService) {
    this.incomeType = null;
    if (this.appSessionStorageService.getCurrentUser() != null) {
      this.currentUser = JSON.parse(this.appSessionStorageService.getCurrentUser()) as AppUser;
    }
  }

  ngOnInit(): void {
    this.projectForm = this._formbuilder.group({
      ProjectName: ['', Validators.compose([Validators.required])],
      clientId: ['', Validators.compose([Validators.required])],
      StartDate: ['', Validators.compose([Validators.required])],
      Deadline: [''],
      Cost: [''],
      Status: [''],
      IsSendMail:[false],
      ProjectTypeIds : ['']
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
    model.Logo = this.websiteLogoImage;
    model.DesignerIds = DesignerIds;
    model.ProjectTypeIds = projectTypeIds;
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
    this.websiteLogoImage = croppedImage.image;
  }

  removeWebsiteLogo() {
    this.websiteLogoImage = "../../../assets/img/weblogo.png"
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
}