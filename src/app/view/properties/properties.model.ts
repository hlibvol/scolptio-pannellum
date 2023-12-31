import { Tag } from "../projects/tag/tag.model";

export class Properties {
    constructor(
        public id?: string,
        public apn?: string,
        public propertyAddress?: string,
        public pCity?: string,
        public pState?: string,
        public pZip?: string,
        public pZip4?: string,
        public pUnitNumber?: string,
        public pUnitType?: string,
        public pCarrierRoute?: string,
        public pHouseNumber?: string,
        public pStreetName?: string,
        public pStreetPrefix?: string,
        public pStreetSuffix?: string,
        public pStreetType?: string,
        public countyName?: string,
        public mailAddress?: string,
        public mCity?: string,
        public mState?: string,
        public mZip?: string,
        public mZip4?: string,
        public mUnitNumber?: string,
        public mUnitType?: string,
        public ownerName?: string,
        public ownerNameFormatted?: string,
        public owner1FName?: string,
        public owner1LName?: string,
        public owner1MName?: string,
        public owner2FName?: string,
        public owner2LName?: string,
        public owner2MName?: string,
        public transfervalue?: string,
        public lastSaleDate?: string,
        public lastContractDate?: string,
        public lastSaleDocNumber?: string,
        public lastSaleBookNumber?: string,
        public lastSalePageNumber?: string,
        public saleType?: string,
        public homeownerExemption?: string,
        public ownerOccupied?: string,
        public phone?: string,
        public propertyType?: string,
        public landUseDescription?: string,
        public zoning?: string,
        public beds?: string,
        public baths?: string,
        public partialBaths?: string,
        public buildingArea?: string,
        public lotArea?: string,
        public lotAreaUnits?: string,
        public numStories?: string,
        public numUnits?: string,
        public yearBuilt?: string,
        public pool?: string,
        public tract?: string,
        public block?: string,
        public lotNumber?: string,
        public areaCode?: string,
        public taxAmount?: string,
        public delinquent?: string,
        public taxRateCodeArea?: string,
        public taxYear?: string,
        public totalAssessedValue?: string,
        public assessedYear?: string,
        public distress?: string,
        public tbMapGrid?: string,
        public tbMapPage?: string,
        public landUse?: string,        
        public longitude?: string,
        public latitude?: string,
        public orgId?: string,
        public importedTime?: any,
        public userId?: string,
        public importFileId?: string,
        public campaignStatus?: string,
        public campaignName?: string,
        public phatchNumber?: Number,
        public images?: string[],
        public documents?: string[],
        public listingId?: string,
        public offerPrice?: string,
        public checked?: boolean,
        public propertyDimension?: string,
        public hoaRestriction?: string,
        public zoningRestriction?: string,
        public accessType?: string,
        public visualAccess?: string,
        public topography?: string,
        public powerAvailable?: string,
        public gasAvailable?: string,
        public pertTest?: string,
        public floodZone?: string,
        public survey?: string,
        public utilities?: string[]
    ) {
    }
}

export class FileUpload {
    constructor(
        public fileName?: string,
        public folderName?: string,
        public fileKey?: string,
        public fileSize?: string,
        public extension?: string,
        public url?: string,
        public type?: string
        
    ) {   }
    // Different fileName and s3FileName are used interchangably in other files, so create accessors
    public get s3FileName(): string{
        return this.fileKey;
    }
    public set s3FileName(value: string){
        this.fileKey = value
    }
}

export class ImageFileUpload extends FileUpload {
    public tags: Tag[] = [];
}