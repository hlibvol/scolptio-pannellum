import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { GalleryItem, ImageItem } from 'ng-gallery';
import { Tag } from 'src/app/view/projects/tag/tag.model';
import { Version } from 'src/app/view/projects/version/version.model';
import { Status } from '../shared.model';

export interface S3File {
    s3Key: string;
    safeUrl: SafeUrl;
    file: File;
    fileName: string;
}

export class S3FileImpl implements S3File{
    public s3Key: string;
    public safeUrl: SafeUrl;
    public file: File;
    public get fileName(): string {
        return this.file?.name;
    }
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
    versions: Version[];
}

export class ProjectS3ImageItem extends ImageItem implements ProjectS3GalleryItem {
    public id: string;
    public s3Key: string;
    public file: File;
    public tags?: Tag[] = [];
    public status: Status = 'added';
    isChecked: boolean = false;
    public fileName: string = '';
    public versions: Version[] = [];
    constructor(private sanitizer: DomSanitizer, url: string, versions: Version[] = []) {
        super({ src: url,thumb: url })
        this.sanitizer = sanitizer;
        this.versions = versions;
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
    protected _url = '';
    constructor(protected sanitizer: DomSanitizer, url: string) {
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

export class ProjectS3VideoItem extends ProjectS3DocumentItem {
    public tags?: Tag[] = [];
    public status: Status = 'added';
    public set safeUrl(url: string | SafeUrl) {
        this._url = this.sanitizer.bypassSecurityTrustUrl(url as string) as string;
    }
}