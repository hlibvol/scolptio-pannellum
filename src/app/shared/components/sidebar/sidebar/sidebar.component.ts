import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppUser } from '../../../../view/auth-register/auth-register.model';
import { AppSessionStorageService } from '../../../session-storage.service';

declare var $: any;
@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit, AfterViewInit {

  currentUser: AppUser;
  isHide : boolean = true;
  isDesignerHide : boolean = true;
  isClientHide : boolean = true;
  constructor(private appSessionStorageService: AppSessionStorageService,
    private router: Router) { }

  ngOnInit(): void {
    if (this.appSessionStorageService.getCurrentUser() != null) {
      this.currentUser = JSON.parse(this.appSessionStorageService.getCurrentUser()) as AppUser;
      if(this.currentUser.Role == "Client"){
        this.isHide = false;
        this.isClientHide = false;
      }
      else if(this.currentUser.Role == "Designer"){
        this.isHide = false;
        this.isDesignerHide = false;
      }
    }
  }

  ngAfterViewInit() {
    $('.menu-activated-on-click').on('click', 'li.has-sub-menu > a', function (event) {
      var $elem = $(this).closest('li');

      if ($elem.hasClass('active')) {
        $elem.removeClass('active');
      } else {
        $elem.closest('ul').find('li.active').removeClass('active');
        $elem.addClass('active');
      }

      return false;
    });
  }

  logOut() {
    this.appSessionStorageService.resetStorage();
    this.router.navigate(['login']);
  }

}
