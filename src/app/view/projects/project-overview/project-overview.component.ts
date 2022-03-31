import { Component,  OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-project-overview',
  templateUrl: './project-overview.component.html',
  styleUrls: ['./project-overview.component.scss']
})
export class ProjectOverviewComponent implements OnInit {

  id: string = ''
  activeSection:string="HandSketchesAndDrawings"
  constructor(private activatedRoute: ActivatedRoute, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(async (params) => {
      if (params['id'])
        this.id = params['id'];
       else
        this.toastr.error('Something went wrong. Please try again later.');
    });
  }
  showSection(section: string){
    this.activeSection = section;
  }
}
