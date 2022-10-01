import { Component, OnInit, ChangeDetectionStrategy, AfterViewInit, AfterContentInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd, Params, PRIMARY_OUTLET, NavigationStart, NavigationCancel } from '@angular/router';
import { BroadcasterService } from 'ng-broadcaster';

@Component({
  selector: 'app-breadcumb',
  templateUrl: './breadcumb.component.html',
  styleUrls: ['./breadcumb.component.scss']
})
export class BreadcumbComponent implements OnInit,AfterContentInit {

  breadcumbs: any;
  private _overwrite: boolean = true;
  constructor(private route: ActivatedRoute, private router: Router,private broadcaster: BroadcasterService) { 
    this.broadcaster.on<any>('onLogin').subscribe(
      
      path => { 
        this.breadcumbs = path;
        this._overwrite = false;
      }
    )
    
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        // Show progress spinner or progress bar
        this._overwrite = true;
        this.getCurrentLocation(event.url,0);
      }
    })
  }

  ngOnInit(): void {
    if(!this._overwrite && this.breadcumbs) {
      return;
    }
    this.breadcumbs = [];
  }
  
  ngAfterContentInit(): void {
    this.getCurrentLocation(window.location.href,3);
  }

  getCurrentLocation(url,indexStart) {
    
    if(!this._overwrite && this.breadcumbs) {
      return;
    }
    this.breadcumbs = [];
    if (url == "/") {
      this.breadcumbs.push({"pathname": "Dashboard", "url": window.location.origin + '/'});
    } else {
      let location = url;
      let locations : string[] = location.split("/");
      let data = {
        "pathname": "Dashboard",
        "url": '/dashboard'
      }  
      this.breadcumbs.push(data);
      for (let i = indexStart; i < locations.length; i ++) {
        if(locations[i]=="")
        {
          continue;
        }
        else if (i == locations.length - 1) {
          let data = {
            "pathname": locations[i],
            "url": '/' + locations[i]
          }
          if(this.breadcumbs.findIndex(x=>x.pathname.toLocaleLowerCase() == locations[i].toLocaleLowerCase())==-1)
          this.breadcumbs.push(data);
        } else {
          let data = {
            "pathname": locations[i],
            "url": "javascript:void(0)"
          }
          if(this.breadcumbs.findIndex(x=>x.pathname.toLocaleLowerCase() == locations[i].toLocaleLowerCase())==-1)
          this.breadcumbs.push(data);
        } 
      }  
    }
  }
}
