import { Component, OnInit } from '@angular/core';
import { AppUser } from '../../auth-register/auth-register.model';
import { AppSessionStorageService } from '../../../shared/session-storage.service';
import { MailhouseService } from '../mailhouse.service';
import { Mailhouse, Order } from '../mailhouse.model';

@Component({
  selector: 'app-mailhouse-list',
  templateUrl: './mailhouse-list.component.html',
  styleUrls: ['./mailhouse-list.component.scss',
    '../../../../assets/css/app.css',]
})
export class MailhouseListComponent implements OnInit {

  mailhouses: Mailhouse[];
  selectedList: Mailhouse;
  currentUser: AppUser;
  pageNumber = 1;
  pageSize = 10;
  total = 0;
  isLoading = false;
  orders: Order[];
  pending = 0;
  processing = 0;
  processed = 0;
  delivered = 0;
  canceled = 0;
  undeliverable = 0;

  constructor(private mailhouseService: MailhouseService,
    private appSessionStorageService: AppSessionStorageService) {
    this.selectedList = new Mailhouse();
  }

  ngOnInit(): void {
    if (this.appSessionStorageService.getCurrentUser() != null) {
      this.currentUser = JSON.parse(this.appSessionStorageService.getCurrentUser()) as AppUser;
    }
    this.getList();
    this.GetAllOrders();
  }

  getList() {
    this.isLoading = true;
    this.mailhouseService.GetAll(this.currentUser.OrgId).subscribe((data: any[]) => {
      this.mailhouses = data;
      this.isLoading = false;
    }, (error) => {
      this.isLoading = false;
    })
  }

  GetAllOrders() {
    this.isLoading = true;
    this.mailhouseService.GetAllOrders().subscribe((data: any[]) => {
      this.orders = data;
      this.pending = this.orders.filter((order: Order) => order.status === 'Pending').length;
      this.processing = this.orders.filter((order: Order) => order.status === 'Processing').length;
      this.processed = this.orders.filter((order: Order) => order.status === 'Processed').length;
      this.delivered = this.orders.filter((order: Order) => order.status === 'Delivered').length;
      this.canceled = this.orders.filter((order: Order) => order.status === 'Canceled').length;
      this.undeliverable = this.orders.filter((order: Order) => order.status === 'Undeliverable').length;
      this.isLoading = false;
    }, (error) => {
      this.isLoading = false;
    })
  }

  onChangeEvent() {
    this.getList();
  }

  onPaginationChange(pageNumber: string) {
    const selectedPage = Number(pageNumber);
    if (selectedPage != NaN) {
      this.pageNumber = selectedPage;
      this.getList();
    }
  }

  setSelectedMailhouse(mailhouse: Mailhouse) {
    this.selectedList = mailhouse;
  }

}