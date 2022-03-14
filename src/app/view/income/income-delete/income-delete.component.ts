import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IncomeService } from '../income.service';
import { Income } from '../income.model';
import { ToastrService } from 'ngx-toastr';
import { income_delete } from 'src/app/shared/toast-message-text';
declare var $: any

@Component({
  selector: 'app-income-delete',
  templateUrl: './income-delete.component.html',
  styleUrls: ['./income-delete.component.scss']
})
export class IncomeDeleteComponent implements OnInit {

  @Input() selectedIncome: Income;

  @Output() deleteSuccessEvent = new EventEmitter<string>();

  errorMsg: string;
  hasError = false;

  constructor(private incomeService: IncomeService,
    private toastr: ToastrService) {

  }

  ngOnInit(): void {
  }

  delete() {
    this.hasError = false;
    this.incomeService.DeleteIncome(this.selectedIncome.id).subscribe((data: any) => {
      if (data === false) {
        this.hasError = true;
      } else {
        this.hasError = false;
        this.deleteSuccessEvent.emit("value");
        this.toastr.info(income_delete.delete_income_success);
        $('#deleteIncome').modal('toggle');
      }
    }, (error) => {
      this.errorMsg = error;
      this.toastr.error(income_delete.delete_income_error);
      this.hasError = false;
    })
  }

}
