import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { Income } from '../income.model';
import { IncomeService } from '../income.service';
import { ToastrService } from 'ngx-toastr';
import { income_edit } from 'src/app/shared/toast-message-text';

declare var $: any;
@Component({
  selector: 'app-income-edit',
  templateUrl: './income-edit.component.html',
  styleUrls: ['./income-edit.component.scss',
    '../../../../assets/css/app.css',
    '../../../../assets/css/icons.css']
})
export class IncomeEditComponent implements OnInit, OnChanges {

  @Input() selectedIncome: Income;

  @Output() updateSuccessEvent = new EventEmitter<string>();

  errorMsg = '';
  isLoading = false;
  incomeDescription: string;
  incomeAmount: string;
  incomeStatus: string;
  incomeType: string;
  isSaving = false;

  constructor(private incomeService: IncomeService,
    private toastr: ToastrService) {
  }

  ngOnInit(): void {}

  ngOnChanges() {
    this.reset();
    if (this.selectedIncome) {
      this.incomeDescription = this.selectedIncome.description;
      this.incomeAmount = this.selectedIncome.amount;
      this.incomeType = this.selectedIncome.type;
    }
  }

  save(form: any) {
    this.errorMsg = '';
    this.isSaving = true;
    this.incomeService.UpdateIncome(this.selectedIncome.id, this.selectedIncome.orgId, this.incomeDescription, this.incomeType, this.incomeAmount).subscribe((data: any) => {
      this.isSaving = false;
      this.updateSuccessEvent.emit("value");
      this.toastr.info(income_edit.edit_income_success);
      this.close(form);
    }, (error) => {
      this.errorMsg = error;
      this.toastr.error(income_edit.edit_income_error);
      this.isSaving = false;
    })
  }

  reset() {
    this.incomeDescription = "";
    this.incomeType = "";
    this.incomeAmount = "";
    this.incomeStatus = "";
  }

  close(form: any) {
    form.resetForm();
    this.reset();
    $('#editIncome').modal('toggle');
  }

}
