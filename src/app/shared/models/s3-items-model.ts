import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { GalleryItem, ImageItem } from 'ng-gallery';
import { Tag } from 'src/app/view/projects/tag/tag.model';
import { Status } from '../shared.model';

export interface S3File {
    s3Key: string;
    safeUrl: SafeUrl;
    file: File;
}

export class S3FileImpl{
    public s3Key: string;
    public safeUrl: SafeUrl;
    public file: File;
    constructor(s3Key: string, safeUrl: SafeUrl, file: File){
        this.s3Key = s3Key;
        this.safeUrl = safeUrl;
        this.file = file;
    }
}

export interface ProjectS3GalleryItem extends GalleryItem, S3File{
    id: string;
    tags?: Tag[];
    status: Status;
    isChecked: boolean;
}

export class ProjectS3ImageItem extends ImageItem implements ProjectS3GalleryItem {
    public id: string;
    public s3Key: string;
    public file: File;
    public tags?: Tag[] = [];
    public status: Status = 'added';
    isChecked: boolean = false;
    constructor(private sanitizer: DomSanitizer, url: string) {
        super({ src: url,thumb: url })
        this.sanitizer = sanitizer;
    }
    public get safeUrl(): SafeUrl {
        if(this.data.src)
            return this.sanitizer.bypassSecurityTrustUrl(this.data.src);
        else if(this.file)
            return this.sanitizer.bypassSecurityTrustUrl(window.URL.createObjectURL(this.file));
        else
            return '';
    }
}

export class ProjectS3DocumentItem implements S3File {
    s3Key: string;
    file: File;
    uploadDateTimeUtc: Date;
    fileName: string;
    private _url = '';
    constructor(private sanitizer: DomSanitizer, url: string) {
        this.sanitizer = sanitizer;
        this._url = url;
    }
    public get safeUrl(): SafeUrl {
        if(this._url)
            return this.sanitizer.bypassSecurityTrustUrl(this._url);
        else if(this.file)
            return this.sanitizer.bypassSecurityTrustUrl(window.URL.createObjectURL(this.file));
        else
            return '';
    }
}