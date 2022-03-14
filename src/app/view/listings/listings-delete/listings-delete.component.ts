import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Listing } from '../listing.model';
import { ListingService } from '..//listing.service';
import { ToastrService } from 'ngx-toastr';
import { listings_delete } from '../../../shared/toast-message-text';

declare var $: any

@Component({
  selector: 'app-listings-delete',
  templateUrl: './listings-delete.component.html',
  styleUrls: ['./listings-delete.component.scss']
})
export class ListingsDeleteComponent implements OnInit {

  @Input() selectedList: Listing;

  @Output() deleteSuccessEvent = new EventEmitter<string>();

  errorMsg: string;

  constructor(private listingService: ListingService,
    private toastr: ToastrService) {
  }

  ngOnInit(): void {
  }

  delete() {
    const requestBody = {
      listingId: this.selectedList.id
    }
    this.listingService.Delete(requestBody).subscribe((data: any[]) => {
      this.deleteSuccessEvent.emit("value");
      this.toastr.info(listings_delete.delete_list_success);
      $('#deleteListing').modal('toggle');
    }, (error) => {
      this.errorMsg = error;
      this.toastr.error(listings_delete.delete_list_error);
    })
  }

}
