import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormValidationService } from 'src/app/shared/form-validation.service';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss']
})
export class FaqComponent implements OnInit {

  @Input() modalRef: any;

  faqList: any = [];
  get faqListInput(): boolean {
    return this.faqList;
  }
  @Input() set faqListInput(value: boolean) {
    debugger;
    this.faqList = value;
    if(this.faqList.length > 0){
    }
  }

  @Output() faqListOutput = new EventEmitter<any>();
  
  faqFormGroup: FormGroup;
  formSubmitAttempt: boolean = false;
  constructor(private formbuilder: FormBuilder,
    private _formValidationService: FormValidationService,
  ) { }

  ngOnInit(): void {
    this.bindForm();
  }

  bindForm() {
    this.faqFormGroup = this.formbuilder.group({
      faqQuestion: ['', Validators.compose([Validators.required])],
      faqAwnser: ['', Validators.compose([Validators.required])]
    })
  }

  hide() {
    this.modalRef.hide();
  }

  HasValidationError(key, keyError) {
    return this._formValidationService.HasError(this.faqFormGroup, key, keyError, this.formSubmitAttempt);
  }

  onSubmit(model, isValid) {
    this.formSubmitAttempt = true;
    if (!isValid)
      return false;
    let faqListObj = {
      id: this.getUniqueID(),
      faqQuestion: model.faqQuestion,
      faqAwnser: model.faqAwnser,
    }
    this.faqList.push(faqListObj);
    this.faqListOutput.emit(this.faqList);
    this.formSubmitAttempt = false;
    this.faqFormGroup.reset();
  }

  remove(id) {
    this.faqList = this.faqList.filter(m => m.id != id);
    this.faqListOutput.emit(this.faqList);
  }

  getUniqueID() {
    // Math.random should be unique because of its seeding algorithm.
    // Convert it to base 36 (numbers + letters), and grab the first 9 characters
    // after the decimal.
    return '_' + Math.random().toString(36).substr(2, 9);
  };
}
