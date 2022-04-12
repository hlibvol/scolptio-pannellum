import { Injectable } from '@angular/core';
import { HttpClient, HttpBackend } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ConfigsLoaderService {
  private httpClient: HttpClient;
  private configs: Configs;
  constructor(handler: HttpBackend) {
    this.httpClient = new HttpClient(handler); 
  }
  get ApiUrl() {
    return this.configs.baseUrl; 
  }
  get ConfigsLoadedFrom() {
    return this.configs;
  } 

  get bucket(){
    return this.configs.bucket;
  }

  get region(){
    return this.configs.region;
  }

  get s3AccessKeyId(){
    return this.configs.s3AccessKeyId;
  }

  get s3SecretAccessKey(){
    return this.configs.s3SecretAccessKey;
  }

  get salesSiteUrl(){
    return this.configs.salesSiteUrl;
  }

  public async loadConfigs() : Promise<any> {
    return this.httpClient.get('assets/config.json').pipe(settings => settings)
      .toPromise()
      .then(settings => {
        //debugger;
        this.configs = settings as Configs; 
        //environment.baseUrl = this.configs.baseUrl;
        this.configs.baseUrl = environment.baseUrl;
        this.configs.bucket = environment.bucket;
        this.configs.production = environment.production;
        this.configs.region = environment.region;
        this.configs.s3AccessKeyId = environment.s3AccessKeyId;
        this.configs.s3SecretAccessKey = environment.s3SecretAccessKey;
        this.configs.salesSiteUrl = environment.salesSiteUrl;
      });
  }
}

export interface Configs {
  production: any;
  baseUrl: string;
  bucket:string;
  region:string;
  s3AccessKeyId:string;
  s3SecretAccessKey:string;
  salesSiteUrl:string;
}

export interface Permission {
  module: string;
  action: string;
  show: boolean;
  role: string;
}

export interface PermissionObj {
  permission: Permission[];
}