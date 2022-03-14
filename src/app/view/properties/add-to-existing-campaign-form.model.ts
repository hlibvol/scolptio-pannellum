export class AddToExistingCampaignFM {
    constructor(
        public propertyId?: string,
        public campaignId?: string,
        public campaignList?: {
            id: string,
            name: string,
            properties: any
        }[]
    ) {
    }
}