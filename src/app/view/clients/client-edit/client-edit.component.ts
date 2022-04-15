import { DOCUMENT } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Inject, Input, OnChanges, OnInit, Output, Renderer2, SimpleChanges } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AwsService } from 'src/app/services/aws.service';
import { FormValidationService } from 'src/app/shared/form-validation.service';
import { client_edit, common_error_message } from 'src/app/shared/toast-message-text';
import { Team } from '../../team/team.model';
import { TeamService } from '../../team/team.service';
import { ClientsService } from '../clients.service';
declare var $: any;
declare const google;
@Component({
  selector: 'app-client-edit',
  templateUrl: './client-edit.component.html',
  styleUrls: ['./client-edit.component.scss', '../../../../assets/css/app.css',
    '../../../../assets/css/icons.css']
})

export class ClientEditComponent implements OnInit, AfterViewInit, OnChanges {

  @Input() client: any;
  @Output() updateSuccessEvent = new EventEmitter<string>();

  formsModel: any;
  formSubmitAttempt: boolean = false;
  clientForm: FormGroup;
  errorMsg = '';
  isLoading = false;
  incomeDescription: string;
  incomeAmount: string;
  incomeType: string;
  isSaving = false;
  websiteLogoImage: any = "../../../assets/img/weblogo.png";
  imageProp: any;
  teamList: Team[];
  constructor(private teamService: TeamService, private renderer2: Renderer2, @Inject(DOCUMENT) private document: Document, private _awsService: AwsService, private _formValidationService: FormValidationService, private _formbuilder: FormBuilder,
    private toastr: ToastrService, private cdRef: ChangeDetectorRef, private _clientService: ClientsService) {
    this.incomeType = null;
  }

  ngOnInit(): void {
    this.clientForm = this._formbuilder.group({
      Id: [''],
      FirstName: ['', Validators.compose([Validators.required])],
      LastName: ['', Validators.compose([Validators.required])],
      Email: ['', Validators.compose([Validators.required])],
      PhoneNumber: [''],
      CompanyName: [''],
      CompanyAdress: [''],
      Logo: [''],
      Website: [''],
      TeamId: ['', Validators.compose([Validators.required])],
      IsInvited: [false]
    });
    this.GetAllTeam();
  }

  GetAllTeam() {
    this.isLoading = true;
    this.teamService.GetAllTeam(-1, -1, null, null).subscribe((data: any[]) => {
      this.isLoading = false;
      this.teamList = data;
    }, (error) => {
      this.toastr.error(common_error_message);
      this.isLoading = false;
    })
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.client) {
      this.formData();
      this.initAutocomplete();
    }
  }
  formData() {

    (this.clientForm.controls.Id as FormControl)
      .setValue(this.client.id);
    (this.clientForm.controls.FirstName as FormControl)
      .setValue(this.client.firstName);
    (this.clientForm.controls.LastName as FormControl)
      .setValue(this.client.lastName);
    (this.clientForm.controls.Email as FormControl)
      .setValue(this.client.email);
    (this.clientForm.controls.PhoneNumber as FormControl)
      .setValue(this.client.phoneNumber);
    (this.clientForm.controls.CompanyName as FormControl)
      .setValue(this.client.companyName);
    (this.clientForm.controls.CompanyAdress as FormControl)
      .setValue(this.client.companyAdress);
    this.websiteLogoImage = this.client.logo;
    // (this.clientForm.controls.Logo as FormControl)
    //   .setValue(this.client.logo);
    (this.clientForm.controls.Website as FormControl)
      .setValue(this.client.website);
    (this.clientForm.controls.TeamId as FormControl)
      .setValue(this.client.teamId);
    (this.clientForm.controls.IsInvited as FormControl)
      .setValue(this.client.isInvited);
    if (this.client.isInvited)
      (this.clientForm.controls.IsInvited as FormControl).disable();
      else
      (this.clientForm.controls.IsInvited as FormControl).enable();
  }

  private loadScript(url) {
    return new Promise((resolve, reject) => {
      const script = this.renderer2.createElement('script');
      script.type = 'text/javascript';
      script.src = url;
      script.text = ``;
      script.async = true;
      script.defer = true;
      script.onload = resolve;
      script.onerror = reject;
      this.renderer2.appendChild(this.document.head, script);
    })
  }

  // private loadAutoComplete() {
  //   const url = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyAkgh7ckSQasqRYvX7BXOwEGEzunexf_EY&libraries=places&v=weekly';
  //   this.loadScript(url).then(() => this.initAutocomplete());
  // }

  HasValidationError(key, keyError) {
    return this._formValidationService.HasError(this.clientForm, key, keyError, this.formSubmitAttempt);
  }

  ngAfterViewInit() {
    this.reset();
    this.cdRef.detectChanges();
  }

  onSubmit(model, isValid) {
    this.formSubmitAttempt = true;
    model = this.clientForm.getRawValue();
    this.formsModel = model;
    if (!isValid)
      return false;
    if (model.IsInvited && !(this.clientForm.controls.IsInvited as FormControl).disabled) {
      $('#edit-inviteClient').modal('show');
      return false;
    }
    this.isSaving = true;
    model.Logo = this.websiteLogoImage;
    this._clientService.UpdateClients(model).subscribe(res => {
      this.isSaving = false;
      this.formSubmitAttempt = false;
      this.clientForm.reset();
      this.updateSuccessEvent.emit("value");
      this.toastr.info(client_edit.edit_client_success);
      this.close(null);
    }, error => {
      this.isSaving = false;
      this.formSubmitAttempt = false;
      this.toastr.info(client_edit.edit_client_error);
    })
  }

  selectedOption(isSent) {
    $('#edit-inviteClient').modal('hide');
    if (!isSent) {

      return false;
    }
    this.isSaving = true;
    this.formsModel.Logo = this.websiteLogoImage;
    this._clientService.UpdateClients(this.formsModel).subscribe(res => {
      this.isSaving = false;
      this.formSubmitAttempt = false;
      this.clientForm.reset();
      this.updateSuccessEvent.emit("value");
      this.toastr.info(client_edit.edit_client_success);
      this.close(null);
    }, error => {
      this.isSaving = false;
      this.formSubmitAttempt = false;
      this.toastr.info(client_edit.edit_client_error);
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
    this.clientForm.reset();
    $('#editClient').modal('toggle');

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

    const input = document.getElementById("txtEditSearchPlaces") as HTMLInputElement;
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
      (this.clientForm.controls.CompanyAdress as FormControl)
        .setValue(address);

    });
  }

  onChangeData(val) {
  }

  getInviteValue(invite) {
    switch (invite) {
      case "Invited":
        return 1;
        break;
      case "Registerd":
        return 2;
        break;

    }
  }
}