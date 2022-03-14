import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

declare var $: any;
@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent implements OnInit {

  @Input() pageNumber: number;
  @Input() total: number;
  @Input() pageSize: number;

  @Output() pageChangeEvent = new EventEmitter<string>();

  constructor() { }

  ngOnInit(): void { }

  onPageChange(pageNumber: number) {
    this.pageNumber = pageNumber;
    this.pageChangeEvent.emit(pageNumber.toString());

  }

}
