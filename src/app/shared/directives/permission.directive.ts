import { Directive, ElementRef, HostListener, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { PermissionObj } from 'src/app/services/configs-loader.service';
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
  private defaultDisplayStyle: string = 'block';
  @Input('default-display-style') defaultDisplayStyleGlobal: string = '';
  @Input('default-display-style-xs') defaultDisplayStyleXs: string = '';
  @Input('default-display-style-sm') defaultDisplayStyleSm: string = '';
  @Input('default-display-style-md') defaultDisplayStyleMd: string = '';
  @Input('default-display-style-lg') defaultDisplayStyleLg: string = '';
  data: PermissionObj;
  currentUser: AppUser;
  private _showItem = false;
  constructor(private appSessionStorageService: AppSessionStorageService, private elementRef: ElementRef) {
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
    if(this.module === 'Projects.Cost')
      debugger;
    if(this.defaultDisplayStyleGlobal)
      this.defaultDisplayStyle = this.defaultDisplayStyleGlobal;
    this.defaultDisplayStyleXs = this.defaultDisplayStyleXs ? this.defaultDisplayStyleXs : this.defaultDisplayStyle;
    this.defaultDisplayStyleSm = this.defaultDisplayStyleSm ? this.defaultDisplayStyleSm : this.defaultDisplayStyle;
    this.defaultDisplayStyleMd = this.defaultDisplayStyleMd ? this.defaultDisplayStyleMd : this.defaultDisplayStyle;
    this.defaultDisplayStyleLg = this.defaultDisplayStyleLg ? this.defaultDisplayStyleLg : this.defaultDisplayStyle;
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
      this._showItem = true;
      this.showItem();
    }
  }
  @HostListener('window:resize')
  private showItem() {
    if(!this._showItem)
      return;
    if(window.innerWidth  < 768)
      this.elementRef.nativeElement.style.display = this.defaultDisplayStyleXs;
    else if(window.innerWidth < 992)
      this.elementRef.nativeElement.style.display = this.defaultDisplayStyleSm;
    else if(window.innerWidth < 1200)
      this.elementRef.nativeElement.style.display = this.defaultDisplayStyleMd;
    else
      this.elementRef.nativeElement.style.display = this.defaultDisplayStyleLg;
  }

}
