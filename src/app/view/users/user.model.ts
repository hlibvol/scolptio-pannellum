export class User {
    constructor(
        public id?: string,
        public address?: string,
        public concurrencyStamp?: string,
        public countryName?: string,
        public displayName?: string,
        public dob?: any,
        public email?: string,
        public firstName?: string,
        public lastName?: string,
        public middleName?: string,
        public occupation?: string,
        public organizationId?: string,
        public organizationName?: string,
        public passportNumber?: string,
        public phoneNumber?: string,
        public profileImage?: string,
        public profileImageUrl?: string,
        public roles?: any,
        public salutation?: string,
        public userName?: string,
        public teamName?: string,
        public roleName?: string,
        public status?: string
    ) {
    }
}