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

  constructor(private route: ActivatedRoute, private router: Router,private broadcaster: BroadcasterService) { 
    this.broadcaster.on<any>('onLogin').subscribe(
      path => { this.breadcumbs = path; }
    );
    
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        // Show progress spinner or progress bar
        this.getCurrentLocation(event.url,0);
      }
    })
  }

  ngOnInit(): void {
    this.breadcumbs = [];
  }
  
  ngAfterContentInit(): void {
    this.getCurrentLocation(window.location.href,3);
  }

  getCurrentLocation(url,indexStart) {
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
