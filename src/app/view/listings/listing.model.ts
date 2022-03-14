
export class Listing {
    constructor(
        public accessType?: string,
        public parcelSize?: string,
        public address?: string,
        public city?: string,
        public state?:string,
        public apn?: string,
        public country?: string,
        public floodZone?: string,
        public gasAvailable?: string,
        public hoA_Fees?: number,
        public id?: string,
        public description?: string,
        public listingPrice?: number,
        public mapInformation?: string,
        public marketValue?: number,
        public organizationId?: string,
        public pertTest?: string,
        public powerAvailable?: string,
        public savings?: number,
        public survey?: string,
        public title?: string,
        public topography?: string,
        public utilities?: any,
        public visualAccess?: string,
        public zoning?: string,
        public isFeaturedListing?:any,
        public propertyType?:string,
        public PropertyId?:string,
        public IsFromListingModule?:boolean
        ) {
    }
}
