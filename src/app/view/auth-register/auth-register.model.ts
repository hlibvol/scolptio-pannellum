
export class User {
    constructor(
        public firstName?: string,
        public lastName?: string,
        public address?: string,
        public email?: string,
        public password?: string,
        public confirmPassword?: string,
        public dob?: any,
        public salutation?: string,
        public countryName?: string,
        public profileImageUrl?: string,
        public userCreationDate?: string,
        public displayName?: string,
        public organizationTitle?: string,
        public profileImage?: string,
        public signature?:string,
        public occupation?: string) {
    }
}

export class AppUser {
    constructor(
        public DisplayName?: string,
        public OrgId?: string,
        public OrgName?: string,
        public Permissions?: string,
        public Roles?: string,
        public UserId?: string,
        public UserName?: any,
        public email?: string,
        public exp?: string,
        public profileImageUrl?: string,
        public given_name?: string,
        public occupation?: string,
        public profileImage?: string) {
    }
}