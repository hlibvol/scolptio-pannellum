import { Component, HostListener, OnInit, } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedService } from 'src/app/services/shared.service';
import { AppSessionStorageService } from '../../shared/session-storage.service';

@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.scss']
})
export class AdminLayoutComponent implements OnInit {

  sidebarOpen: boolean = true;
  constructor(private appSessionStorageService: AppSessionStorageService,
    private router: Router,
    private sharedService: SharedService,
    private route: ActivatedRoute) { 
      this.sharedService.scrollAdminLayout$().subscribe(this.scrollBy)
    }

  ngOnInit(): void {
    /* will be removed later*/
    if (!this.appSessionStorageService.getCurrentUser()) {
      if(['', ' ', '/', '\\'].includes(this.router.url) || this.route.snapshot.queryParamMap.get('login_redirect')) {
        this.router.navigate(['login']);
      }
      else{
        this.router.navigate(['login'], {
          queryParams: {
            'login_redirect': this.router.url
          }
        });
      }
      
    } else {
      const mainLayout = document.getElementById('main-layout');
      if (mainLayout.hasAttribute('hidden')) {
        mainLayout.removeAttribute('hidden');
      }
    }
    this.setSidebarState();
  }
  @HostListener('window:resize')
  setSidebarState(): void {
    if(window.innerWidth < 1280)
      this.sidebarOpen = false;
    else
      this.sidebarOpen = true;
  }

  sidebarToggle(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }

  scrollBy(coordinates: {x: number, y: number}): void {
    // @ViewChild is not working for some reason in this component 
    // TO-DO: Troubleshoot or find a way to eliminate document.getElementById
    document.getElementById('main-layout').scrollBy(coordinates.x, coordinates.y); 
  }
}
