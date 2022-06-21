import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppSessionStorageService } from '../../shared/session-storage.service';

@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.scss']
})
export class AdminLayoutComponent implements OnInit {

  sidebarOpen: boolean = true;
  constructor(private appSessionStorageService: AppSessionStorageService,
    private router: Router) { }

  ngOnInit(): void {
    /* will be removed later*/
    if (this.appSessionStorageService.getCurrentUser() == null) {
      this.router.navigate(['login']);
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


}
