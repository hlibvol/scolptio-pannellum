import { Component, OnInit } from '@angular/core';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';

@Component({
  selector: 'app-leads-website-list',
  templateUrl: './leads-website-list.component.html',
  styleUrls: ['./leads-website-list.component.scss',
              '../../../../assets/css/app.css',]
})
export class LeadsWebsiteListComponent implements OnInit {

  pageNumber = 1;
  pageSize = 10;
  total = 0;

  public Editor = ClassicEditor;

  constructor() { }

  ngOnInit(): void {
  }

  onPaginationChange(pageNumber: string) {
    const selectedPage = Number(pageNumber);
    if (selectedPage != NaN) {
      this.pageNumber = selectedPage;
    }
  }

}
