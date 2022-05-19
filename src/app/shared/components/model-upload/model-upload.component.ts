import { Component, ElementRef, EventEmitter, Injector, OnInit, Output, ViewChild, Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subscriber } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import { ConfigsLoaderService } from 'src/app/services/configs-loader.service';
import { FileUpload } from 'src/app/view/properties/properties.model';
import { S3BucketService } from '../../s3-bucket.service';
import { S3File } from '../../shared.model';
import { PutObjectCommand, PutObjectRequest, S3Client } from '@aws-sdk/client-s3';
import { FormControl, FormGroup } from '@angular/forms';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { BaseService } from 'src/app/shared/base.service';

declare var $: any;
@Component({
  selector: 'app-s3-model-upload',
  templateUrl: './model-upload.component.html',
  styleUrls: ['./model-upload.component.scss']
})

@Injectable()
export class ModelUploadComponent  extends BaseService implements OnInit {
  @ViewChild('myS3ModelInput') myS3ModelInput: ElementRef;

  @Output() ModelUploadSuccessEvent = new EventEmitter<FileUpload[]>();

  modelFiles: S3File[];
  modelList: any;
  isSaving = 0;
  isSave2Echo3D = 0;
  isSave2S3 = 0;
  fileUploads: FileUpload[];
  hasSucces = false;
  folderName = uuidv4();
  protected _configLoaderService: ConfigsLoaderService;
  // httpClient:HttpClient;

  constructor( _injector: Injector,
    private toastr: ToastrService, private s3BucketService: S3BucketService/*, private http: HttpClient*/) {
    super(_injector);
    this._configLoaderService = _injector.get(ConfigsLoaderService);
    this.modelFiles = new Array();
    this.fileUploads = new Array();
    // this.httpClient = http;
  }

  ngOnInit(): void {
  }

  close() {
    console.log(this.folderName);
    if (this.fileUploads && this.fileUploads.length > 0) {
      this.ModelUploadSuccessEvent.emit(this.fileUploads);
    }
    this.removeModel();
    $('#uploadModel').modal('toggle');
  }

  removeModel() {
    this.modelFiles = null;
    this.myS3ModelInput.nativeElement.value = "";
    this.modelFiles = new Array();
    this.fileUploads = new Array();
    this.hasSucces = false;
    this.isSaving = 0;
    this.isSave2Echo3D = 0;
    this.isSave2S3 = 0;
    this.folderName = uuidv4();
  }

  prepareView() {
    setTimeout(() => {
      if (this.modelList != null && this.modelList.length > 0) {
        for (let model of this.modelList) {
          const modelFile = new S3File();
          modelFile.file = model;
          this.modelFiles.push(modelFile);
        }
      }
    }, 500);
  }

  onChangeModel($event: Event) {
    const files = ($event.target as HTMLInputElement).files as FileList;
    if (files && files.length > 0) {
      this.modelList = files;
      this.prepareView();
    }
  }

  upload() {
    for (let model of this.modelFiles) {
      setTimeout(() => {
        this.uploadModels(model);
      }, 500);
    }
  }

  upload2echo3d() {
    for (let model of this.modelFiles) {
      setTimeout(() => {
        this.uploadModels2Echo3D(model);
      }, 500);
    }
  }

  
  public uploadModels2EchoJS(modelFile: S3File) {
    // var formdata = new FormData();
    // formdata.append("email", "richworld3tai@gmail.com");
    // formdata.append("target_type", "2");
    // formdata.append("hologram_type", "2");
    // formdata.append("type", "upload");
    // formdata.append("file_model", fileInput.files[0], "/E:/f_2022.5.4_scolptio/_design_obj/Cabinet with TAP and Basin.glb");
    // formdata.append("secKey", "1tTujWk3SsZTgtU6tXxEHVa9");
    // formdata.append("key", "cold-term-5928");
    
    // var requestOptions = {
    //   method: 'POST',
    //   body: formdata,
    //   redirect: 'follow'
    // };
    // fetch("https://api.echo3D.co/upload", requestOptions)
    //   .then(response => response.text())
    //   .then(result => console.log(result))
    //   .catch(error => console.log('error', error));
  }

  public uploadModels2Echo3D(modelFile: S3File) {
    const extension = (/[.]/.exec(modelFile.file.name)) ? /[^.]+$/.exec(modelFile.file.name)[0] : undefined;
    const uuid = uuidv4();
    const modelFileName = uuid + '.' + extension;
    
    var tmppath = URL.createObjectURL(modelFile.file);
    console.log("xxxPath:",tmppath);

    let headers = new Headers();
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');  
    headers.append('Access-Control-Allow-Origin', 'https://localhost:4200');
    headers.append('Access-Control-Allow-Credentials', 'true');
    const requestOptions = {                                                                                                                                                                                 
      headers: headers, 
    };

    let formdata = new FormData();
    console.log("xxx_uploadModelsEcho3D:",modelFile.file.toString(), /*modelFile.file.webkitRelativePath, */modelFile.file.name, this.folderName);
    formdata.append("file_model","E://f_2022.5.4_scolptio//_design_obj//Cabinet with TAP and Basin.glb"/*modelFile.file.name*/);
    formdata.append("email","contact@scolptio.com");
    formdata.append("target_type","2");
    formdata.append("hologram_type","2");
    formdata.append("type","upload");
    formdata.append("secKey","0zROLz9vCAyIvfXABW0rnQ5U");
    formdata.append("key","sparkling-frog-6857");

    let formdataBlob = new FormData();
    //formdataBlob.append("name",modelFile.file.name);
    formdataBlob.append("assetfile",modelFile.file,modelFile.file.name);

    let raw = JSON.stringify({
      "file_model": "E://f_2022.5.4_scolptio//_design_obj//Cabinet with TAP and Basin.glb",
      "email": "contact@scolptio.com",
      "target_type": "2",
      "hologram_type": "2",
      "type": "upload",
      "secKey": "0zROLz9vCAyIvfXABW0rnQ5U",
      "key": "sparkling-frog-6857"
    });
    let raw1 = JSON.stringify({
      "Url": tmppath,
    });
    this.isSaving++;
    this.isSave2Echo3D++;
    modelFile.status = 'uploading';    


    this
    //.postecho3dB("upload",raw1)
    .postecho3dC("upload",formdataBlob)
    .subscribe((res)=>{
      console.log("xxx_api return",res);
      let retid = res["id"];
      this.isSaving--;
      this.isSave2Echo3D--;
      modelFile.status = 'success';
      const modelUrl = "https://api.echo3D.co/webar?key=sparkling-frog-6857&entry="+retid;//`https://${this._configLoaderService.bucket}.s3.${this._configLoaderService.region}.amazonaws.com/${this.folderName}/${modelFileName}`;

      const modelUpload = new FileUpload();
      modelUpload.fileName = modelFile.file.name;
      modelUpload.folderName = this.folderName;
      modelUpload.fileKey = retid;
      modelUpload.extension = extension;
      modelUpload.fileSize = modelFile.file.size.toString();
      modelUpload.url = modelUrl;

      
      this.fileUploads.push(modelUpload);
      this.hasSucces = true;
    },
    (error) => {
      // error handling.
      this.isSaving--;
      this.isSave2Echo3D--;
      modelFile.status = 'error';
    }      
    );
    /*


    const client = new S3Client({
      credentials: {
        accessKeyId: "AKIAYRELZPYTB44GTA42",
        secretAccessKey: "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"
      },
      region: "us-east-2"
    });

    const params: PutObjectRequest = {
      Bucket: "scolptio-crm-bucket",
      Key: `${this.folderName}/${modelFileName}`,
      Body: modelFile.file,
    };

    const command = new PutObjectCommand(params);
    this.isSaving++;
    modelFile.status = 'uploading';
    client.send(command).then(
      (data) => {
        this.isSaving--;
        modelFile.status = 'success';
        const modelUrl = `https://${this._configLoaderService.bucket}.s3.${this._configLoaderService.region}.amazonaws.com/${this.folderName}/${modelFileName}`;

        const modelUpload = new FileUpload();
        modelUpload.fileName = modelFile.file.name;
        modelUpload.folderName = this.folderName;
        modelUpload.fileKey = modelFileName;
        modelUpload.extension = extension;
        modelUpload.fileSize = modelFile.file.size.toString();
        modelUpload.url = modelUrl;

        
        this.fileUploads.push(modelUpload);
        this.hasSucces = true;
      },
      (error) => {
        // error handling.
        this.isSaving--;
        modelFile.status = 'error';
      }
    );

    */
  }


  public uploadModels(modelFile: S3File) {

    const extension = (/[.]/.exec(modelFile.file.name)) ? /[^.]+$/.exec(modelFile.file.name)[0] : undefined;
    const uuid = uuidv4();
    const modelFileName = uuid + '.' + extension;
    
    const client = new S3Client({
      credentials: {
        accessKeyId: "AKIAYRELZPYTB44GTA42",
        secretAccessKey: "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"
      },
      region: "us-east-2"
    });

    // const params: PutObjectRequest = {
    //   Bucket: "scolptio-crm-bucket",
    //   Key: `${this.folderName}/${modelFileName}`,
    //   Body: modelFile.file,
    // };


    const params: PutObjectRequest = {
      Bucket: "scolptiocrmincoming1",
      Key: `model/uncompressed/${modelFile.file.name}`,
      Body: modelFile.file,
    };
    
    const command = new PutObjectCommand(params);
    this.isSaving++;
    this.isSave2S3++;
    modelFile.status = 'uploading';
    client.send(command).then(
      (data) => {
        this.isSaving--;
        this.isSave2S3--;
        modelFile.status = 'success';
        const modelUrl = `https://${this._configLoaderService.bucket}.s3.${this._configLoaderService.region}.amazonaws.com/${this.folderName}/${modelFileName}`;
        // const modelUrl = `https://d2pz0mg31mouq1.cloudfront.net/model/${modelFileName}`;

        const modelUpload = new FileUpload();
        modelUpload.fileName = modelFile.file.name;
        modelUpload.folderName = this.folderName;
        modelUpload.fileKey = modelFileName;
        modelUpload.extension = extension;
        modelUpload.fileSize = modelFile.file.size.toString();
        modelUpload.url = modelUrl;

        
        this.fileUploads.push(modelUpload);
        this.hasSucces = true;
      },
      (error) => {
        // error handling.
        this.isSaving--;
        this.isSave2S3--;
        modelFile.status = 'error';
      }
    );
  }
}
