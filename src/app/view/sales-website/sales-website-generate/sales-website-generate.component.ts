import { Component, ElementRef, OnInit, SecurityContext, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { AwsService } from 'src/app/services/aws.service';
import { ConfigsLoaderService } from 'src/app/services/configs-loader.service';
import { FormValidationService } from 'src/app/shared/form-validation.service';
import { AppSessionStorageService } from 'src/app/shared/session-storage.service';
import { S3File } from 'src/app/shared/shared.model';
import { AppUser } from '../../auth-register/auth-register.model';
import { FileUpload } from '../../properties/properties.model';
import { SalesWebsiteService } from '../sales-website.service';


@Component({
  selector: 'app-sales-website-generate',
  templateUrl: './sales-website-generate.component.html',
  styleUrls: ['./sales-website-generate.component.scss', '../../../../assets/css/app.css']
})
export class SalesWebsiteGenerateComponent implements OnInit {

  public Editor = ClassicEditor;
  editorForm: FormGroup;
  formSubmitAttempt: boolean = false;
  isSaving: boolean = false;
  image: any;
  ImageName: any;
  id: any;
  siteImages: any = [];
  renderImage: any = "../../../assets/img/weblogo.png";
  currentUser: AppUser;
  siteUrl: any;
  @ViewChild("ContactPageTel1", { static: false }) ph1: ElementRef;
  @ViewChild("ContactPageTel2", { static: false }) ph2: ElementRef;
  hideWebsiteAddressSection: boolean = false;
  websiteLogoImage: any = "../../../assets/img/weblogo.png";;
  inventoryHomeImage: any = "../../../assets/img/weblogo.png";;
  aboutUsImage: any = "../../../assets/img/weblogo.png";
  modalRef: any;
  faqList: any = [];
  salesWebsiteObj: any;
  constructor(private _formbuilder: FormBuilder,
    private _formValidationService: FormValidationService,
    private _SalesWebsiteService: SalesWebsiteService,
    private _toaster: ToastrService,
    private _awsService: AwsService,
    private appSessionStorageService: AppSessionStorageService,
    private sanitizer: DomSanitizer,
    private modalService: BsModalService,
    private _router: Router,
    private _activatedRouter: ActivatedRoute,
    private _configLoaderService : ConfigsLoaderService
  ) {
    if (this.appSessionStorageService.getCurrentUser() != null) {
      this.currentUser = JSON.parse(this.appSessionStorageService.getCurrentUser()) as AppUser;
      this.siteUrl = this._configLoaderService.salesSiteUrl + "/home/" + this.currentUser.OrgId;
    }
    // this._awsService.GetUrl("423a1dca-a96a-4505-946c-9b0cbbe5777f.jpg").then(res => {
    //   this.renderImage = res;
    // })

    this._activatedRouter.params.subscribe(res => {
      this.id = res["id"];
      this.getSalesWebsite(this.id);
    })
  }

  ngOnInit(): void {
    this.editorForm = this._formbuilder.group({
      id: [''],
      WebsiteLogo: ['', Validators.compose([Validators.required])],
      WebsiteName: ['', Validators.compose([Validators.required])],
      WebAddress: ['', Validators.compose([Validators.required])],
      Type: [''],
      RecordValue: [''],
      HomeNavColor: ['', Validators.compose([Validators.required])],
      HomeHeaderText1: ['', Validators.compose([Validators.required])],
      HomeHeaderText2: ['', Validators.compose([Validators.required])],
      HomeHeaderText3: ['', Validators.compose([Validators.required])],
      InventoryHeaderPhoto: ['', Validators.compose([Validators.required])],
      HomeInventoryHeading: ['', Validators.compose([Validators.required])],
      HomeInvenotrySub: ['', Validators.compose([Validators.required])],
      AboutPagePhoto: ['', Validators.compose([Validators.required])],
      HomeFooterText: ['', Validators.compose([Validators.required])],
      ContactPageAddress: ['', Validators.compose([Validators.required])],
      ContactPageTel1: ['', Validators.compose([Validators.required])],
      ContactPageTel2: ['', Validators.compose([Validators.required])],
      ContactPageEmail: ['', Validators.compose([Validators.required, Validators.email])],
      TermsDescription: ['', Validators.compose([Validators.required])],
      Status: ['', Validators.compose([Validators.required])],
      faqList: ['', Validators.compose([Validators.required])],
    });

  }

  getSalesWebsite(id: any) {
    this._SalesWebsiteService.GetById(id).subscribe(res => {
      this.salesWebsiteObj = res;
    }, null, () => { this.formData() })
  }

  formData() {
    // this.dateOfBirth = this.adminObj.dob;
    // this.dateOfJoin = this.adminObj.dateOfJoin;
    // this.Formatted_Address = this.adminObj.formatted_Address;
    // this.image = this.environment.baseUrl + "/api/Admins/image/" +this.adminObj.id + '?v=' + Math.random();
    if (this.salesWebsiteObj && this.salesWebsiteObj.websiteLogo) {
      this._awsService.GetUrl(this.salesWebsiteObj.websiteLogo).then(res => {
        this.websiteLogoImage = res;
        (this.editorForm.controls.WebsiteLogo as FormControl).setErrors(null);
      });
    }

    if (this.salesWebsiteObj.inventoryHeaderPhoto) {
      this._awsService.GetUrl(this.salesWebsiteObj.inventoryHeaderPhoto).then(res => {
        this.inventoryHomeImage = res;
        (this.editorForm.controls.InventoryHeaderPhoto as FormControl).setErrors(null);
      });
    }
    if (this.salesWebsiteObj.aboutPagePhoto) {
      this._awsService.GetUrl(this.salesWebsiteObj.aboutPagePhoto).then(res => {
        this.aboutUsImage = res;
        (this.editorForm.controls.AboutPagePhoto as FormControl).setErrors(null);
      });
    }

    this.faqList = this.salesWebsiteObj.faqList;
    (this.editorForm.controls.id as FormControl)
      .setValue(this.salesWebsiteObj.id);
    // (this.editorForm.controls.WebsiteLogo as FormControl)
    //   .setValue(this.salesWebsiteObj.websiteLogo);
    (this.editorForm.controls.WebsiteName as FormControl)
      .setValue(this.salesWebsiteObj.websiteName);

    if (!this.salesWebsiteObj.webAddress) {
      this.hideWebsiteAddressSection = true;

      (this.editorForm.controls.WebAddress as FormControl).setErrors(null);

      (this.editorForm.controls.Type as FormControl)
        .setValue(this.salesWebsiteObj.type);
      (this.editorForm.controls.RecordValue as FormControl)
        .setValue(this.salesWebsiteObj.recordValue);

      (this.editorForm.controls.Type as FormControl).setValidators([Validators.required]);
      (this.editorForm.controls.Type as FormControl).markAsDirty();
      (this.editorForm.controls.RecordValue as FormControl).setValidators([Validators.required]);
      (this.editorForm.controls.RecordValue as FormControl).markAsDirty();

    }
    else {
      (this.editorForm.controls.WebAddress as FormControl)
        .setValue(this.salesWebsiteObj.webAddress);
    }
    (this.editorForm.controls.HomeNavColor as FormControl)
      .setValue(this.salesWebsiteObj.homeNavColor);
    (this.editorForm.controls.HomeHeaderText1 as FormControl)
      .setValue(this.salesWebsiteObj.homeHeaderText1);
    (this.editorForm.controls.HomeHeaderText2 as FormControl)
      .setValue(this.salesWebsiteObj.homeHeaderText2);
    (this.editorForm.controls.HomeHeaderText2 as FormControl)
      .setValue(this.salesWebsiteObj.homeHeaderText2);
    (this.editorForm.controls.HomeHeaderText3 as FormControl)
      .setValue(this.salesWebsiteObj.homeHeaderText3);
    // (this.editorForm.controls.InventoryHeaderPhoto as FormControl)
    //   .setValue(this.salesWebsiteObj.inventoryHeaderPhoto);
    (this.editorForm.controls.HomeInventoryHeading as FormControl)
      .setValue(this.salesWebsiteObj.homeInventoryHeading);
    (this.editorForm.controls.HomeInvenotrySub as FormControl)
      .setValue(this.salesWebsiteObj.homeInvenotrySub);
    // (this.editorForm.controls.AboutPagePhoto as FormControl)
    //   .setValue(this.salesWebsiteObj.aboutPagePhoto);
    (this.editorForm.controls.HomeFooterText as FormControl)
      .setValue(this.salesWebsiteObj.homeFooterText);
    (this.editorForm.controls.ContactPageAddress as FormControl)
      .setValue(this.salesWebsiteObj.contactPageAddress);
    (this.editorForm.controls.ContactPageTel1 as FormControl)
      .setValue(this.salesWebsiteObj.contactPageTel1);
    (this.editorForm.controls.ContactPageTel2 as FormControl)
      .setValue(this.salesWebsiteObj.contactPageTel2);
    (this.editorForm.controls.ContactPageEmail as FormControl)
      .setValue(this.salesWebsiteObj.contactPageEmail);
    (this.editorForm.controls.TermsDescription as FormControl)
      .setValue(this.salesWebsiteObj.termsDescription);
    (this.editorForm.controls.Status as FormControl)
      .setValue(this.GetStatusValue(this.salesWebsiteObj.status));
    (this.editorForm.controls.faqList as FormControl)
      .setValue(this.salesWebsiteObj.faqList);
  }

  // getSafeUrl(url){
  //   return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  // }
  onSubmit(model, isValid) {
    this.formSubmitAttempt = true;
    if (!isValid)
      return false;
    this.isSaving = true;
    model.organizationId = this.currentUser.OrgId;
    model.createdBy = this.currentUser.UserId;
    model.ContactPageTel1 = this.ph1.nativeElement.value;
    model.ContactPageTel2 = this.ph2.nativeElement.value;
    model.faqList = this.faqList;
    if (this.id) {
      model.id = this.id;
      this._SalesWebsiteService.Update(model).subscribe(res => {
        let cnt = 0;
        if (this.siteImages.length <= 0) {
          this.isSaving = false;
          this._toaster.success("Site information updated successfully");
          this.siteUrl = this.siteUrl + "?id=" + Math.random();
          //this._router.navigate(["sales-website/list"]);
        }
        else {
          this.siteImages.forEach(async (element, index) => {
            let image = new S3File();
            image.file = await this.dataUrlToFile(element.image, element.imageName);

            if (element.property == "WebsiteLogo" && this.salesWebsiteObj.websiteLogo) {
              await this._awsService.DeleteImage(this.salesWebsiteObj.websiteLogo).then(res => {
              })
            }
            else if (element.property == "AboutPagePhoto" && this.salesWebsiteObj.aboutPagePhoto) {
              await this._awsService.DeleteImage(this.salesWebsiteObj.aboutPagePhoto).then(res => {
              })
            } else if (element.property == "InventoryHeaderPhoto" && this.salesWebsiteObj.inventoryHeaderPhoto) {
              await this._awsService.DeleteImage(this.salesWebsiteObj.inventoryHeaderPhoto).then(res => {
              })
            }

            await this._awsService.uploadImages(image).then(async (res: FileUpload) => {
              console.log(res);

              let model = {
                property: element.property,
                imageKey: res.fileKey,
                id: this.id
              }

              await this._SalesWebsiteService.UploadImage(model).subscribe(res => {
                cnt++;
                console.log("index", cnt);
                if (cnt == this.siteImages.length) {
                  this.isSaving = false;
                  this._toaster.success("Site information updated successfully");
                  this.siteUrl = this.siteUrl + "?id=" + Math.random();
                }
              })

            })


          });
        }
      })
    }
    else {
      this._SalesWebsiteService.Save(model).subscribe(async res => {
        this.id = res.value;
        let cnt = 0;
        this.siteImages.forEach(async (element, index) => {
          let image = new S3File();
          image.file = await this.dataUrlToFile(element.image, element.imageName);

          await this._awsService.uploadImages(image).then(async (res: FileUpload) => {
            console.log(res);

            let model = {
              property: element.property,
              imageKey: res.fileKey,
              id: this.id
            }

            await this._SalesWebsiteService.UploadImage(model).subscribe(res => {
              cnt++;
              console.log("index", cnt);
              if (cnt == 3) {
                this.isSaving = false;
                this._toaster.success("Site information saved successfully");
                this.siteUrl = this.siteUrl + "?id=" + Math.random();
              }
            })

          })


        });




      })
    }

  }

  public async dataUrlToFile(dataUrl: string, fileName: string): Promise<File> {

    const res: Response = await fetch(dataUrl);
    const blob: Blob = await res.blob();
    return new File([blob], fileName, { type: 'image/png' });
  }
  HasValidationError(key, keyError) {
    return this._formValidationService.HasError(this.editorForm, key, keyError, this.formSubmitAttempt);
  }

  public onReturnData(data: any) {
    (this.editorForm.controls.WebsiteLogo as FormControl).setErrors(null);
    const croppedImage = JSON.parse(data);
    this.siteImages.push({
      property: "WebsiteLogo",
      image: croppedImage.image,
      imageName: croppedImage.filename
    })
    this.websiteLogoImage = croppedImage.image;
    console.log(this.siteImages);
  }

  removeWebsiteLogo() {
    this.siteImages = this.siteImages.filter(m => m.property != "WebsiteLogo");
    (this.editorForm.controls.WebsiteLogo as FormControl).setErrors({ required: true });
    this.websiteLogoImage = "../../../assets/img/weblogo.png"
  }

  public onReturnDataBannerPhoto(data: any) {
    (this.editorForm.controls.InventoryHeaderPhoto as FormControl).setErrors(null);
    const croppedImage = JSON.parse(data);
    this.siteImages.push({
      property: "InventoryHeaderPhoto",
      image: croppedImage.image,
      imageName: croppedImage.filename
    })
    this.inventoryHomeImage = croppedImage.image;
    console.log(this.siteImages);
  }

  removeInventoryHeaderPhoto() {
    this.siteImages = this.siteImages.filter(m => m.property != "InventoryHeaderPhoto");
    (this.editorForm.controls.InventoryHeaderPhoto as FormControl).setErrors({ required: true });
    this.inventoryHomeImage = "../../../assets/img/weblogo.png";
  }

  public onReturnAboutPagePhoto(data: any) {
    (this.editorForm.controls.AboutPagePhoto as FormControl).setErrors(null);
    const croppedImage = JSON.parse(data);
    this.siteImages.push({
      property: "AboutPagePhoto",
      image: croppedImage.image,
      imageName: croppedImage.filename
    })
    this.aboutUsImage = croppedImage.image;
    console.log(this.siteImages);
  }

  removeAboutPagephoto() {
    this.siteImages = this.siteImages.filter(m => m.property != "AboutPagePhoto");
    (this.editorForm.controls.AboutPagePhoto as FormControl).setErrors({ required: true });
    this.aboutUsImage = "../../../assets/img/weblogo.png";
  }

  visibleCustomDomainSection() {

    (this.editorForm.controls.Type as FormControl).setValidators([Validators.required]);
    (this.editorForm.controls.Type as FormControl).markAsDirty();
    (this.editorForm.controls.RecordValue as FormControl).setValidators([Validators.required]);
    (this.editorForm.controls.RecordValue as FormControl).markAsDirty();

    (this.editorForm.controls.WebAddress as FormControl).setValidators([]);
    (this.editorForm.controls.WebAddress as FormControl).updateValueAndValidity();
    (this.editorForm.controls.WebAddress as FormControl).setValue("");
    this.hideWebsiteAddressSection = true;
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, { animated: false, class: 'modal-xl' });
  }

  addFaqListToForm(model: any) {
    this.faqList = model;
    console.log(this.faqList);
    if (this.faqList.length > 0) {
      (this.editorForm.controls.faqList as FormControl).setErrors(null);
    }
    else {
      (this.editorForm.controls.faqList as FormControl).setErrors({ required: true });
    }
  }

  remove(id) {
    this.faqList = this.faqList.filter(m => m.id != id);
  }

  GetStatusValue(value: any) {
    switch (value) {
      case "Draft":
        return 0;
      case "Published":
        return 1;
      case "InActive":
        return 2;
    }
  }

}
