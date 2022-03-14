import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { Expenditure } from '../expenditure.model';
import { ExpenditureService } from '../expenditure.service';
import { ToastrService } from 'ngx-toastr';
import { expenditure_edit } from 'src/app/shared/toast-message-text';

declare var $: any;
@Component({
  selector: 'app-expenditure-edit',
  templateUrl: './expenditure-edit.component.html',
  styleUrls: ['./expenditure-edit.component.scss',
    '../../../../assets/css/app.css',
    '../../../../assets/css/icons.css']
})
export class ExpenditureEditComponent implements OnInit, OnChanges {

  @Input() selectedExpenditure: Expenditure;

  @Output() updateSuccessEvent = new EventEmitter<string>();

  errorMsg = '';
  isLoading = false;
  expenditureDescription: string;
  expenditureAmount: string;
  expenditureType: string;
  isSaving = false;

  constructor(private expenditureService: ExpenditureService,
    private toastr: ToastrService) {
  }

  ngOnInit(): void {}

  ngOnChanges() {
    this.reset();
    if (this.selectedExpenditure) {
      this.expenditureDescription = this.selectedExpenditure.description;
      this.expenditureAmount = this.selectedExpenditure.amount;
      this.expenditureType = this.selectedExpenditure.type;
    }
  }

  save(form: any) {
    this.errorMsg = '';
    this.isSaving = true;
    this.expenditureService.UpdateExpenditure(this.selectedExpenditure.id, this.selectedExpenditure.orgId, this.expenditureDescription, this.expenditureType, this.expenditureAmount).subscribe((data: any) => {
      this.isSaving = false;
      this.updateSuccessEvent.emit("value");
      this.toastr.info(expenditure_edit.edit_expenditure_success);
      this.close(form);
    }, (error) => {
      this.errorMsg = error;
      this.toastr.error(expenditure_edit.edit_expenditure_error);
      this.isSaving = false;
    })
  }

  reset() {
    this.expenditureDescription = "";
    this.expenditureType = "";
    this.expenditureAmount = "";
  }

  close(form: any) {
    form.resetForm();
    this.reset();
    $('#editExpenditure').modal('toggle');
  }

}
