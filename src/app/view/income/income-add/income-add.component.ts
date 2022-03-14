import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { IncomeService } from '../income.service';
import { ToastrService } from 'ngx-toastr';
import { income_add } from 'src/app/shared/toast-message-text';

declare var $: any;
@Component({
  selector: 'app-income-add',
  templateUrl: './income-add.component.html',
  styleUrls: ['./income-add.component.scss',
    '../../../../assets/css/app.css',
    '../../../../assets/css/icons.css']
})
export class IncomeAddComponent implements OnInit, AfterViewInit {

  @Output() addSuccessEvent = new EventEmitter<string>();

  errorMsg = '';
  isLoading = false;
  incomeDescription: string;
  incomeAmount: string;
  incomeType: string;
  isSaving = false;
  constructor(private incomeService: IncomeService,
    private toastr: ToastrService,private cdRef:ChangeDetectorRef) {
    this.incomeType = null;
  }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.reset();
    this.cdRef.detectChanges();
  }

  save(form: any) {
    this.errorMsg = '';
    const incomeMembers = [];
    const members = document.getElementById('members-add');
    if (members != null) {
      const options = members['options'];
      if (options && options.length > 0) {
        for (const option of options) {
          if (option.selected) {
            incomeMembers.push(option.value);
          }
        }
      }
    }
    this.isSaving = true;
    this.incomeService.SaveIncome(this.incomeDescription, this.incomeAmount,  this.incomeType).subscribe((data: any) => {
      this.isSaving = false;
      this.addSuccessEvent.emit("value");
      this.toastr.info(income_add.add_income_success);
      this.close(form);
    }, (error) => {
      this.errorMsg = error;
      this.toastr.error(income_add.add_income_error);
      this.isSaving = false;
    })
  }

  reset() {
    this.incomeDescription = "";
    this.incomeAmount = "";
    this.incomeType = "";
  }

  close(form: any) {
    form.resetForm();
    this.reset();
    $('#addIncome').modal('toggle');

  }

}
