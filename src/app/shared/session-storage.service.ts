import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Injectable()
export class AppSessionStorageService {
    private key_token = 'key_token';
    private current_user = 'current_user';
    private user_permissions = 'user_permissions';

    constructor(private cookieService: CookieService) {
    }
    resetStorage() {
        sessionStorage.clear();
        this.cookieService.deleteAll();
    }

    storeToken(value: any) {
        sessionStorage.setItem(this.key_token, value);
    }

    getToken() {
        return sessionStorage.getItem(this.key_token);
    }

    storeCurrentUser(value: any) {
        sessionStorage.setItem(this.current_user, value);
    }

    getCurrentUser() {
        return sessionStorage.getItem(this.current_user);
    }

    storeUserPermissions(value: any) {
        sessionStorage.setItem(this.user_permissions, value);
    }

    getUserPermissions() {
        return sessionStorage.getItem(this.user_permissions);
    }

    storeProperty<T = any>(key: string, value: T) {
        sessionStorage.setItem(key, JSON.stringify(value));
    }

    getProperty<T = any>(key: string): T {
        return JSON.parse(sessionStorage.getItem(key)) as T;
    }
}