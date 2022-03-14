import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-delete',
  templateUrl: './delete.component.html',
  styleUrls: ['./delete.component.scss']
})
export class DeleteComponent implements OnInit {

  @Input() deleteId;
  @Output() id = new EventEmitter<any>();
  @Input() modalRef:any;
  @Input() text:any;
  @Input() header:any;
  constructor() { }

  ngOnInit(): void {
  }

  delete(){
    this.id.emit(this.deleteId);
  }

  hide() {
    this.modalRef.hide();
  }


}
