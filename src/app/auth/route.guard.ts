import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AppSessionStorageService } from '../shared/session-storage.service';

@Injectable({ providedIn: 'root' })
export class RouteGuardService implements CanActivate {

    constructor(private router: Router,
        private appSessionStorageService: AppSessionStorageService) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        if (this.appSessionStorageService.getCurrentUser() != null) {
            if (state.url === '/') {
                return true;
            } else {
                const permission = JSON.parse(this.appSessionStorageService.getUserPermissions());
                const hasPermission = permission.find(x => x.includes(state.url.replace('/', 'view_')));
                if (hasPermission) {
                    return true;
                } else {
                    return false;
                }
            }
        } else {
            return false;
        }

    }
}