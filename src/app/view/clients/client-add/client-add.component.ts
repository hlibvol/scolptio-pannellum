import { DOCUMENT } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Inject, OnInit, Output, Renderer2 } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AwsService } from 'src/app/services/aws.service';
import { FormValidationService } from 'src/app/shared/form-validation.service';
import { S3File } from 'src/app/shared/shared.model';
import { clients_add, common_error_message, income_add } from 'src/app/shared/toast-message-text';
import { IncomeService } from '../../income/income.service';
import { Team } from '../../team/team.model';
import { TeamService } from '../../team/team.service';
import { ClientsService } from '../clients.service';
declare var $: any;
declare const google;
@Component({
  selector: 'app-client-add',
  templateUrl: './client-add.component.html',
  styleUrls: ['./client-add.component.scss', '../../../../assets/css/app.css',
    '../../../../assets/css/icons.css']
})
export class ClientAddComponent implements OnInit, AfterViewInit {

  @Output() addSuccessEvent = new EventEmitter<string>();

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
  constructor(private teamService: TeamService,private renderer2: Renderer2, @Inject(DOCUMENT) private document: Document, private _awsService: AwsService, private _formValidationService: FormValidationService, private _formbuilder: FormBuilder,
    private toastr: ToastrService, private cdRef: ChangeDetectorRef, private _clientService: ClientsService) {
    this.incomeType = null;
  }

  ngOnInit(): void {
    this.clientForm = this._formbuilder.group({
      FirstName: ['', Validators.compose([Validators.required])],
      LastName: ['', Validators.compose([Validators.required])],
      Email: ['', Validators.compose([Validators.required])],
      PhoneNumber: [''],
      CompanyName: [''],
      CompanyAdress: [''],
      Logo: [''],
      Website: [''],
      TeamId : ['',Validators.compose([Validators.required])]
    });
    this.GetAllTeam();
    this.loadAutoComplete();
  }

  GetAllTeam() {
    this.isLoading = true;
    this.teamService.GetAllTeam(-1,-1,null,null).subscribe((data: any[]) => {
      this.isLoading = false;
      this.teamList =  data;
    }, (error) => {
      this.toastr.error(common_error_message);
      this.isLoading = false;
    })
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

  private loadAutoComplete() {
    const url = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyAkgh7ckSQasqRYvX7BXOwEGEzunexf_EY&libraries=places&v=weekly';
    this.loadScript(url).then(() => this.initAutocomplete());
  }

  HasValidationError(key, keyError) {
    return this._formValidationService.HasError(this.clientForm, key, keyError, this.formSubmitAttempt);
  }

  ngAfterViewInit() {
    this.reset();
    this.cdRef.detectChanges();
  }

  onSubmit(model, isValid) {
    this.formSubmitAttempt = true;
    if (!isValid)
      return false;
    this.isSaving = true;
    model.Logo = this.websiteLogoImage;
    this._clientService.SaveClients(model).subscribe(res => {
      this.isSaving = false;
      this.formSubmitAttempt = false;
      this.addSuccessEvent.emit("value");
      this.toastr.info(clients_add.add_client_success);
      this.close(null);
    }, error => {
      this.isSaving = false;
      this.formSubmitAttempt = false;
      this.toastr.info(clients_add.add_client_error);
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
    $('#addclient').modal('toggle');

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
      (this.clientForm.controls.CompanyAdress as FormControl)
      .setValue(address);
      
    });
  }

  onChangeData(val){
  }
}
