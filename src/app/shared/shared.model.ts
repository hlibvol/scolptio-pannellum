export class Organization {
    constructor(
        public title?: string,
        public imageId?: string,
        public description?: string,
        public address?: string,
        public createdBy?: any,
        public timeZone?: string,
        public status?: string,
        public adminName?: string,
        public image?: string,
        public id?: string,
        public email?: string,
        public phone?: string,
        public fax?: string
    ) {
    }
}


export class PropertyFile {
    constructor(
        public id?: string,
        public name?: string,
        public uploadedBy?: string,
        public description?: string,
        public extension?: string,
        public fileSize?: number,
        public url?: string,
        public fileKey?: string,
        public orgId?: string,
        public uploadDate?: string
    ) {
    }
}

export type Status = 'added' | 'uploading' | 'success' | 'error';

export class S3File {
    constructor(
        public file?: File,
        public status?: Status) {
        this.status = 'added';
    }
}
