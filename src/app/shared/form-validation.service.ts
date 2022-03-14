import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Injectable({ providedIn: "root" })
export class FormValidationService {
    HasError(formGroup: FormGroup, key: any, keyError: any, formSubmitAttempt: boolean = false) {
        if ((formGroup.controls['' + key + ''].dirty || formGroup.controls['' + key + ''].untouched) && formSubmitAttempt) {
            const controlErrors: any = formGroup.get(key).errors;
            if (controlErrors != null) {
                return controlErrors[keyError] != null ? true : false;
            }
        }
        return false;
      
        // return (!formGroup.controls['' + key + ''].valid && formGroup.controls['' + key + ''].touched) ||
        //     (formGroup.controls['' + key + ''].untouched && formSubmitAttempt);
    }
    FormControlIsValid(formGroup: FormGroup, key: any) {
        return ((formGroup.controls['' + key + ''].dirty) && (!formGroup.controls['' + key + ''].valid)) == true ? true : false;
    }

    MustMatch(controlName: string, matchingControlName: string) {
        return (formGroup: FormGroup) => {
            const control = formGroup.controls[controlName];
            const matchingControl = formGroup.controls[matchingControlName];
    
            if (matchingControl.errors && !matchingControl.errors.mustMatch) {
                // return if another validator has already found an error on the matchingControl
                return;
            }
    
            // set error on matchingControl if validation fails
            if (control.value !== matchingControl.value) {
                matchingControl.setErrors({ mustMatch: true });
            } else {
                matchingControl.setErrors(null);
            }
        }
    }
}