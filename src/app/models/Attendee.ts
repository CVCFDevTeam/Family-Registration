export class Attendee {

    constructor(
        public first_name: string,
        public last_name: string,
        public t_shirt: string,
        public gender: string,
        public age: number,
        public medical: string,
        public address: string,
        public address_2: string,
        public city: string,
        public state: string,
        public zip_code: string,
        public email: string,
        public emergency_contact_first_name: string,
        public emergency_contact_last_name: string,
        public emergency_contact_phone_number: string,
        public emergency_contact_relationship: string,
        public your_church: string,
        public your_church_point_of_contact_name: string,
        public your_church_point_of_contact_number: string,
        public days_attending: string,
        public cost: number
    ) {
    }


}
