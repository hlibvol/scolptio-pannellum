import { AfterViewInit, Component, OnInit } from '@angular/core';
import { AppUser } from '../../../../view/auth-register/auth-register.model';
import { LayoutService } from '../../../layout.service';
import { AppSessionStorageService } from '../../../session-storage.service';
import { Organization } from '../../../shared.model';
import jwt_decode from "jwt-decode";
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

declare var $: any;
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, AfterViewInit {

  organizations: Organization[];
  currentUser: AppUser;
  curentUserOrg: Organization;
  orgCount: number;
  constructor(private layoutService: LayoutService,
    private appSessionStorageService: AppSessionStorageService,
    private toastr: ToastrService,
    private router: Router) {
    this.curentUserOrg = new Organization();
  }

  ngOnInit(): void {
    if (this.appSessionStorageService.getCurrentUser() != null) {
      this.currentUser = JSON.parse(this.appSessionStorageService.getCurrentUser()) as AppUser;
      this.GetUserOrganization();
    }
    this.orgCount = 0;
  }
  ngAfterViewInit() {
    setTimeout(() => {
      $('.os-dropdown-trigger').on('mouseenter', function () {
        $(this).addClass('over');
      });
      $('.os-dropdown-trigger').on('mouseleave', function () {
        $(this).removeClass('over');
      });
      this.setCompanyDropdown();
    }, 200);
  }

  GetUserOrganization() {
    this.layoutService.GetUserOrganization().subscribe((data: any[]) => {
      for (let i = 0; i < data.length; i ++) {
        if (data[i].adminName === this.currentUser.DisplayName) {
          this.orgCount ++;
          this.curentUserOrg = data[i]
        }
      }
      
      this.organizations = data.filter(x => x.id != this.currentUser.OrgId);
    }, (error) => {
      this.toastr.error('Something went wrong, could not get user Organization.');
    })
  }

  tokenExchange(orgId: string) {
    this.layoutService.TokenExchange(orgId).subscribe((data: any) => {
      this.appSessionStorageService.storeToken(data.toString());
      const currentUser = jwt_decode(data) as AppUser;
      debugger;
      const user_permissions = JSON.parse(currentUser.Permissions ? currentUser.Permissions : null);

      if (this.appSessionStorageService.getCurrentUser() != null) {
        const sessionUser = JSON.parse(this.appSessionStorageService.getCurrentUser()) as AppUser;
        currentUser.occupation = sessionUser.occupation;
        currentUser.profileImage = sessionUser.profileImage;
      }

      this.appSessionStorageService.storeCurrentUser(JSON.stringify(currentUser));
      this.appSessionStorageService.storeUserPermissions(JSON.stringify(user_permissions));
      window.location.reload();
    })
  }

  logOut() {
    this.appSessionStorageService.resetStorage();
    this.router.navigate(['login']);
  }

  setCompanyDropdown() {
    $('#openCompanyInfo').on('click', function () {
      $(this).closest('.fancy-selector-w').toggleClass('opened');
    });

    $('#sliderOpen').on('click', function () {
      $("#Main").toggleClass('closeSlider');
      $(this).closest('.fancy-selector-w').toggleClass('opened1');
    });
    
  }
}
