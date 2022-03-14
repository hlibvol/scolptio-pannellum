import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ExpenditureService } from '../expenditure.service';
import { ToastrService } from 'ngx-toastr';
import { expenditure_add } from 'src/app/shared/toast-message-text';

declare var $: any;
@Component({
  selector: 'app-expenditure-add',
  templateUrl: './expenditure-add.component.html',
  styleUrls: ['./expenditure-add.component.scss',
    '../../../../assets/css/app.css',
    '../../../../assets/css/icons.css']
})
export class ExpenditureAddComponent implements OnInit, AfterViewInit {

  @Output() addSuccessEvent = new EventEmitter<string>();

  errorMsg = '';
  isLoading = false;
  expenditureDescription: string;
  expenditureAmount: string;
  expenditureType: string;
  isSaving = false;
  constructor(private expenditureService: ExpenditureService,
    private toastr: ToastrService,private cdRef:ChangeDetectorRef) {
    this.expenditureType = null;
  }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.reset();
    this.cdRef.detectChanges();
  }

  save(form: any) {
    this.errorMsg = '';
    this.isSaving = true;
    this.expenditureService.SaveExpenditure(this.expenditureDescription, this.expenditureAmount,  this.expenditureType).subscribe((data: any) => {
      this.isSaving = false;
      this.addSuccessEvent.emit("value");
      this.toastr.info(expenditure_add.add_expenditure_success);
      this.close(form);
    }, (error) => {
      this.errorMsg = error;
      this.toastr.error(expenditure_add.add_expenditure_error);
      this.isSaving = false;
    })
  }

  reset() {
    this.expenditureDescription = "";
    this.expenditureAmount = "";
    this.expenditureType = "";
  }

  close(form: any) {
    form.resetForm();
    this.reset();
    $('#addExpenditure').modal('toggle');

  }

}
