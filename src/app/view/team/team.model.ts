export class Role {
    constructor(
        public title?: string,
        public permissions?: Permission[],
        public id?: string
    ) {
    }
}

export class Permission {
    constructor(
        public description?: string,
        public title?: string,
        public key?: string,
        public category?: string,
        public isActive?: boolean,
        public isShownInUi?: boolean,
        public group?: string,
        public id?: string
    ) {
    }
}

export class Team {
    constructor(
        public id?: string,
        public teamName?: string,
        public organizationId?: string,
        public users?: any,
        public role?: string,
        public createdBy?: string,
        public createdDate?: any
    ) {
    }
}
