import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd, Params, PRIMARY_OUTLET, NavigationStart, NavigationCancel } from '@angular/router';

@Component({
  selector: 'app-breadcumb',
  templateUrl: './breadcumb.component.html',
  styleUrls: ['./breadcumb.component.scss']
})
export class BreadcumbComponent implements OnInit {

  breadcumbs: any;

  constructor(private route: ActivatedRoute, private router: Router) { 
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        // Show progress spinner or progress bar
        this.getCurrentLocation(event.url);
      }
    })
  }

  ngOnInit(): void {
    this.breadcumbs = [];
  }

  getCurrentLocation(url) {
    this.breadcumbs = [];
    if (url == "/") {
      this.breadcumbs.push({"pathname": "Dashboard", "url": window.location.origin + '/'});
    } else {
      let location = url;
      let locations = location.split("/");
      for (let i = 0; i < locations.length; i ++) {
        if (i == 0) {
          let data = {
            "pathname": "Dashboard",
            "url": '/'
          }  
          this.breadcumbs.push(data);
        } else if (i == locations.length - 1) {
          let data = {
            "pathname": locations[i],
            "url": '/' + locations[i]
          }
          this.breadcumbs.push(data);
        } else {
          let data = {
            "pathname": locations[i],
            "url": "javascript:void(0)"
          }
          this.breadcumbs.push(data);
        } 
      }  
    }
  }
}
