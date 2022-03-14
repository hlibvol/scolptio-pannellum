import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ExpenditureService } from '../expenditure.service';
import { Expenditure } from '../expenditure.model';
import { ToastrService } from 'ngx-toastr';
import { expenditure_delete } from 'src/app/shared/toast-message-text';
declare var $: any

@Component({
  selector: 'app-expenditure-delete',
  templateUrl: './expenditure-delete.component.html',
  styleUrls: ['./expenditure-delete.component.scss']
})
export class ExpenditureDeleteComponent implements OnInit {

  @Input() selectedExpenditure: Expenditure;

  @Output() deleteSuccessEvent = new EventEmitter<string>();

  errorMsg: string;
  hasError = false;

  constructor(private expenditureService: ExpenditureService,
    private toastr: ToastrService) {

  }

  ngOnInit(): void {
  }

  delete() {
    this.hasError = false;
    this.expenditureService.DeleteExpenditure(this.selectedExpenditure.id).subscribe((data: any) => {
      if (data === false) {
        this.hasError = true;
      } else {
        this.hasError = false;
        this.deleteSuccessEvent.emit("value");
        this.toastr.info(expenditure_delete.delete_expenditure_success);
        $('#deleteExpenditure').modal('toggle');
      }
    }, (error) => {
      this.errorMsg = error;
      this.toastr.error(expenditure_delete.delete_expenditure_error);
      this.hasError = false;
    })
  }

}
