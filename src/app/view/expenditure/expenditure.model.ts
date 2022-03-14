export class Expenditure {
    constructor(
        public id?: string,
        public orgId? :string,
        public description?: string,
        public type?: string,
        public amount?: string,
        public status?: string,
        public createdDate?: any
    ) {
    }
}
