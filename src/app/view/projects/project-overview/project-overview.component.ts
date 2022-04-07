import { Component,  OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AppSessionStorageService } from 'src/app/shared/session-storage.service';
import { AppUser } from '../../auth-register/auth-register.model';

@Component({
  selector: 'app-project-overview',
  templateUrl: './project-overview.component.html',
  styleUrls: ['./project-overview.component.scss']
})
export class ProjectOverviewComponent implements OnInit {

  id: string = ''
  activeSection:string="HandSketchesAndDrawings";
  isHide: boolean = true;
  currentUser:AppUser;
  constructor(private activatedRoute: ActivatedRoute, private toastr: ToastrService,private appSessionStorageService: AppSessionStorageService,) { 
    if (this.appSessionStorageService.getCurrentUser() != null) {
      this.currentUser = JSON.parse(this.appSessionStorageService.getCurrentUser()) as AppUser;
      if(this.currentUser.Role == "Client"){
        this.isHide = false;
      }
      else if(this.currentUser.Role == "Designer"){
        this.isHide = false;
      }
    }
  }

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
