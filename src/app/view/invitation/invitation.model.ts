export class Invitation {
    constructor(
        public id?: string,
        public senderId?: string,
        public senderEmail?: string,
        public orgId?: string,
        public invitedUserEmail?: string,
        public teamId?: any,
        public phone?: string,
        public name?: string
    ) {
    }
}