import { Injectable } from '@angular/core';
import { Properties } from '../view/properties/properties.model';

@Injectable()
export class AppSessionStorageService {
    private key_token = 'key_token';
    private current_user = 'current_user';
    private user_permissions = 'user_permissions';
    private selected_property = 'selected_property';

    constructor() {
    }
    resetStorage() {
        sessionStorage.clear();
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

    storeProperty(value: Properties) {
        sessionStorage.setItem(this.selected_property, JSON.stringify(value));
    }

    getProperty(): Properties {
        return JSON.parse(sessionStorage.getItem(this.selected_property)) as Properties;
    }
}