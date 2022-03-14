import { Component, OnInit } from '@angular/core';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';


@Component({
  selector: 'app-county-planner',
  templateUrl: './county-planner.component.html',
  styleUrls: ['./county-planner.component.scss']
})
export class CountyPlannerComponent implements OnInit {

  public Editor = ClassicEditor;


  constructor() { }

  ngOnInit(): void {
  }

}
