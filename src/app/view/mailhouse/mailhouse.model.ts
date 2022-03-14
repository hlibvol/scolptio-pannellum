export class Mailhouse {
    constructor(
        public name?: string,
        public apiKey?: string,
        public id?: string,
        public contactEmail?: string,
        public phoneNumber?: string,
        public contactName?: any,
        public organizationId?: string,
        public status?: string) {
    }
}

export class Order {
    constructor(
        public orderID?: string,
        public batchID?: string,
        public status?: string,
        public designID?: string,
        public mailClass?: string,
        public source?: any,
        public orderDate?: string,
        public recipientList?: any,
        public design?: string) {
    }
}