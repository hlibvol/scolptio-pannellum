import { HttpClient } from '@angular/common/http';
import { Directive, ElementRef, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Configs, PermissionObj } from 'src/app/services/configs-loader.service';
import { AppUser } from 'src/app/view/auth-register/auth-register.model';
import { AppSessionStorageService } from '../session-storage.service';
import { permission } from './permission';

@Directive({
  selector: '[appPermission]'
})
export class PermissionDirective implements OnInit, OnChanges {
  @Input('appPermission') option: any;
  @Input("module") module: any;
  @Input("action") action: any;
  @Input() role: any;
  data: PermissionObj;
  currentUser: AppUser;
  constructor(private appSessionStorageService: AppSessionStorageService, private elementRef: ElementRef, private httpClient: HttpClient) {
    this.currentUser = JSON.parse(this.appSessionStorageService.getCurrentUser()) as AppUser;
    if (!this.currentUser) return;
    if (this.currentUser.Role == "Client") {
      this.role = "client";
    }
    else if (this.currentUser.Role == "Designer") {
      this.role = "designer";
    }
    else {
      this.role = "admin"
    }
    this.loadConfigs();
  }

  ngOnInit(): void {
    this.elementRef.nativeElement.style.setProperty('display', 'none', 'important');
    this.loadConfigs();
  }
  ngOnChanges(changes: SimpleChanges): void {
    console.log("changes", changes);
  }

  public async loadConfigs(): Promise<any> {
    if (!this.currentUser) return;
    this.data = permission as PermissionObj;
    let isPermission = this.data.permission.find(m => m.module == this.module && m.action == this.action && m.role == this.role);
    if (isPermission && isPermission.show) {
      this.elementRef.nativeElement.style.display = "block";
    }
  }

}
