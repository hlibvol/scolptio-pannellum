import { AfterViewInit, Component, OnInit,ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subscriber } from 'rxjs';
import { AppSessionStorageService } from '../../shared/session-storage.service';
import { AppUser, User } from '../auth-register/auth-register.model';
import { AccountSettingService } from './account-settings.service';
import { account_settings } from '../../shared/toast-message-text';
import { SignaturePad } from 'angular2-signaturepad';

declare var $: any;
@Component({
  selector: 'app-account-settings',
  templateUrl: './account-settings.component.html',
  styleUrls: ['./account-settings.component.scss']
})
export class AccountSettingsComponent implements OnInit, AfterViewInit {
  @ViewChild(SignaturePad) signaturePad: SignaturePad;
  isLoading = false;
  isSaving = false;
  errorMsg = '';
  userInfo: User;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
  imageData: string;
  signaturePadOptions: Object = {
    'minWidth': 100,
    'canvasHeight': 150,
    'canvasWidth': 800,
  };
  symbolFormat = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
  letterFormat = /[a-zA-Z]/;
  numberFormat = /[0-9]/;
  signatureImage:any;

  constructor(private accountSettingService: AccountSettingService,
    private appSessionStorageService: AppSessionStorageService,
    private toastr: ToastrService) {
    this.userInfo = new User();
  }

  ngOnInit(): void {
    this.GetUserInformation();
  }

  ngAfterViewInit() {
    this.signaturePad.set('minWidth', 1);
    this.signaturePad.clear();
  }

  clear() {
    this.signaturePad.clear();
  }

  GetUserInformation() {
    this.isLoading = true;
    this.errorMsg = '';
    this.accountSettingService.GetUserInformation().subscribe((data: any) => {
      this.userInfo = data;
      console.log(this.userInfo)
      this.signatureImage = this.userInfo.signature;
      this.userInfo.dob = this.formateDate(this.userInfo.dob);
      const self = this;
      $('input.single-daterange').daterangepicker({
        "singleDatePicker": true,
        'autoUpdateInput': false,
        "startDate": this.userInfo.dob,
        locale: {
          format: 'MM/DD/YYYY'
        }
      }, function (start, end, label) {
        self.userInfo.dob = self.formateDate(start.toString());
      });
      this.imageData = this.userInfo.profileImage;
      this.isLoading = false;
    }, (error) => {
      this.errorMsg = error;
      this.toastr.error(account_settings.get_userinfo_error);
      this.isLoading = false;
    });
  }

  save() {
    this.errorMsg = '';
    this.isLoading = true;
    const updateUser = Object.assign({}, this.userInfo);
    updateUser.dob = this.formateDateToISO(updateUser.dob);
    updateUser.profileImage = this.imageData;
    updateUser.signature = this.signaturePad.toDataURL("image/png");
    this.accountSettingService.UpdateUserInformation(updateUser).subscribe((data: any[]) => {
      this.isLoading = false;
      if (this.appSessionStorageService.getCurrentUser() != null) {
        const currentUser = JSON.parse(this.appSessionStorageService.getCurrentUser()) as AppUser;
        currentUser.DisplayName = this.userInfo.firstName + ' ' + this.userInfo.lastName;
        currentUser.occupation = this.userInfo.occupation;
        currentUser.profileImage = this.imageData;
        this.appSessionStorageService.storeCurrentUser(JSON.stringify(currentUser));
      }
      this.toastr.info(account_settings.update_userinfo_success);
    }, (error) => {
      this.errorMsg = error;
      this.toastr.error(account_settings.update_userinfo_error);
      this.isLoading = false;
    })
  }

  changePassword() {
    this.errorMsg = '';
    this.isSaving = true;
    const errorMsg = document.getElementById('change-password-error') as HTMLDivElement;
    errorMsg.setAttribute('hidden', 'true');
    const successMsg = document.getElementById('change-password-success') as HTMLDivElement;
    successMsg.setAttribute('hidden', 'true');
    this.accountSettingService.ChangePassword(this.currentPassword, this.newPassword).subscribe((data: any) => {
      this.isSaving = false;
      if (data === false) {
        errorMsg.removeAttribute('hidden');
      } else {
        this.toastr.info(account_settings.password_change_success);
      }
    }, (error) => {
      this.errorMsg = error;
      this.toastr.error(account_settings.password_change_error);
      this.isSaving = false;
    })
  }

  formateDate(dob: any) {
    var formattedDate = '';
    let date = new Date(dob);
    if (date && date.getFullYear() < 1900) {
      date = new Date();
    }

    const month = this.pad2(date.getMonth() + 1);//months (0-11)
    const day = this.pad2(date.getDate());//day (1-31)
    const year = date.getFullYear();
    formattedDate = month + "/" + day + "/" + year;
    return formattedDate;
  }


  formateDateToISO(dob: any) {
    var formattedDate = '';
    let date = new Date(dob);

    const month = this.pad2(date.getMonth() + 1);//months (0-11)
    const day = this.pad2(date.getDate());//day (1-31)
    const year = date.getFullYear();
    formattedDate = year + '-' + month + '-' + day + 'T00:00:00Z';
    return formattedDate;
  }

  pad2(n) {
    return (n < 10 ? '0' : '') + n;
  }

  hasSymbol(text: string) {
    return this.symbolFormat.test(text);
  }

  hasLetter(text: string) {
    return this.letterFormat.test(text);
  }

  hasNumber(text: string) {
    return this.numberFormat.test(text);
  }

  showPassword(id: string) {
    const el = document.getElementById(id) as HTMLInputElement;
    if (el && el.type === 'password') {
      el.type = 'text';
    } else {
      el.type = 'password';
    }
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

}
