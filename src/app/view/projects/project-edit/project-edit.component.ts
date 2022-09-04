import { DOCUMENT, formatDate } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Inject, Input, OnChanges, OnInit, Output, Renderer2, SimpleChanges } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { NgOption } from '@ng-select/ng-select';
import { ToastrService } from 'ngx-toastr';
import { AwsService } from 'src/app/services/aws.service';
import { FormValidationService } from 'src/app/shared/form-validation.service';
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
  @Input()
  statusList: NgOption[] = [];
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
    if(this.projectForm){
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
        IsSendMail:[false],
        SquareFootage : ['']
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
    this.prepareMemberData();

  }

  prepareMemberData() {
    setTimeout(() => {
      debugger
      if (this.project && this.project.designerIds != null && this.project.designerIds.length > 0) {
        const role = document.getElementById('user-role-edit');
        if (role) {
          const options = role['options'];
          if (options && options.length > 0) {
            for (let i = 0; i < options.length; i++) {
              const isExist = this.project.designerIds.find((x: any) => x === options[i].value);
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
}