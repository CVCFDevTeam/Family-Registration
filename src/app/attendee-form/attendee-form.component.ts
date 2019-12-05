import { Component, OnInit, Input } from '@angular/core';
import { Attendee } from '../Models/Attendee';
import { FormControl, FormGroup, Validators, FormBuilder, FormArray } from '@angular/forms';

import { HttpClient, HttpHeaders } from '@angular/common/http';

import { UserService } from '../services/user.service';

const httpOptions = {
    headers: new HttpHeaders({
        'Content-Type': 'application/json'
    })
};

@Component({
    selector: 'app-attendee-form',
    templateUrl: './attendee-form.component.html'
})

export class AttendeeFormComponent implements OnInit {
    attendeeForm: FormGroup;

    // Basic Information
    first_name = new FormControl('', Validators.required);
    last_name = new FormControl('', Validators.required);
    t_shirt = new FormControl('', Validators.required);
    gender = new FormControl('', Validators.required);
    age = new FormControl('', Validators.required);
    medical = new FormControl('', Validators.required);
    address = new FormControl('', Validators.required);
    address_2 = new FormControl('');
    city = new FormControl('', Validators.required);
    state = new FormControl('', Validators.required);
    zip_code = new FormControl('', Validators.required);
    email = new FormControl('');

    // Emergency Information
    emergency_contact_first_name = new FormControl('', Validators.required);
    emergency_contact_last_name = new FormControl('', Validators.required);
    emergency_contact_phone_number = new FormControl('', Validators.required);
    emergency_contact_relationship = new FormControl('', Validators.required);

    // Church Information
    your_churches = new FormControl('', Validators.required);
    your_church = new FormControl('');
    your_church_point_of_contact_name = new FormControl('');
    your_church_point_of_contact_number = new FormControl('');

    // Basic Values
    max_index = 0;
    current_index = 0;
    cost = 0;
    days_attending = '';

    currentAttendee: Attendee;
    shouldSlice = true;
    model = new Attendee('', '', '', '', null, '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', null, '', '', false, '');

    // Lists
    people = [];
    sizes = ['S', 'M', 'L', 'XL', 'XXL'];
    genders = ['Male', 'Female'];
    states = ['AK', 'AL', 'AR', 'AZ', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA', 'HI',
        'IA', 'ID', 'IL', 'IN', 'KS', 'KY', 'LA', 'MA', 'MD', 'ME', 'MI',
        'MN', 'MO', 'MS', 'MT', 'NC', 'ND', 'NE', 'NH', 'NJ', 'NM', 'NV',
        'NY', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT',
        'VA', 'VT', 'WA', 'WI', 'WV', 'WY'];
    church_list = ['Other', 'MN - <ChurchName>', 'ND - <ChurchName>', 'NH - <ChurchName>', 'AZ - <ChurchName>',
        'CA - <ChurchName>', 'PA - <ChurchName>', 'VA - <ChurchName>', 'CO - <ChurchName>',
        'NJ - <ChurchName>', 'NY - <ChurchName>', 'KY - <ChurchName>', 'NC - <ChurchName>',
        'N/A'];
    days_chosen = [
        { name: 'Friday', selected: true, id: 1 },
        { name: 'Saturday', selected: true, id: 2 },
        { name: 'Sunday', selected: true, id: 3 },
        { name: 'Monday', selected: true, id: 4 }
    ];
    days_bool = [
        true, true, true, true
    ];


    constructor(private fb: FormBuilder, private http: HttpClient, private userService: UserService) {
        this.attendeeForm = fb.group({

            // Basic Information
            'first_name': this.first_name,
            'last_name': this.last_name,
            't_shirt': this.t_shirt,
            'gender': this.gender,
            'age': this.age,
            'medical': this.medical,
            'address': this.address,
            'address_2': this.address_2,
            'city': this.city,
            'state': this.state,
            'zip_code': this.zip_code,
            'email': this.email,

            // Emergency Information
            'emergency_contact_first_name': this.emergency_contact_first_name,
            'emergency_contact_last_name': this.emergency_contact_last_name,
            'emergency_contact_phone_number': this.emergency_contact_phone_number,
            'emergency_contact_relationship': this.emergency_contact_relationship,

            // Church Information
            'your_churches': this.your_churches,
            'your_church': this.your_church,
            'your_church_point_of_contact_name': this.your_church_point_of_contact_name,
            'your_church_point_of_contact_number': this.your_church_point_of_contact_number,

            days: this.fb.array(this.days_bool),
        });
    }

    ngOnInit() {
        this.loadAttendees();
        this.checkChurch();
    }

    // CRUD Options
    // Add attendee by creating a new attendee and navigating to it.
    // Previous form must be valid before moving on.
    // Must show active on new form.
    addAttendee() {
        // Check if church value is set to standard value or Other, and updates the form properly
        this.checkChurch();

        // If the form is valid, updates the service with the new value
        if (this.attendeeForm.valid) {
            const attendee = new Attendee('', '', '', '', null, '', '', '', '', '', '',
                '', '', '', '', '', '', '', '', '', null, '', '', false, '');

            // Update attendee fields when valid form
            attendee.first_name = this.first_name.value;
            attendee.last_name = this.last_name.value;
            attendee.t_shirt = this.t_shirt.value;
            attendee.gender = this.gender.value;
            attendee.age = this.age.value;
            attendee.medical = this.medical.value;
            attendee.address = this.address.value;
            attendee.address_2 = this.address_2.value;
            attendee.city = this.city.value;
            attendee.state = this.state.value;
            attendee.zip_code = this.zip_code.value;
            attendee.email = this.email.value;
            attendee.emergency_contact_first_name = this.emergency_contact_first_name.value;
            attendee.emergency_contact_last_name = this.emergency_contact_last_name.value;
            attendee.emergency_contact_phone_number = this.emergency_contact_phone_number.value;
            attendee.emergency_contact_relationship = this.emergency_contact_relationship.value;
            attendee.your_church = this.your_church.value;
            attendee.your_church_point_of_contact_name = this.your_church_point_of_contact_name.value;
            attendee.your_church_point_of_contact_number = this.your_church_point_of_contact_number.value;

            // Updates days attending and cost before pushing change
            this.numDaysCheck();
            attendee.days_attending = this.days_attending;
            attendee.cost = this.cost;

            // Updates the attendee to the service when the form is valid
            this.userService.addAttendee(this.current_index, attendee);

            this.currentAttendee = attendee;

            if (this.shouldSlice) {
                this.people.splice(this.max_index, 1);
            }

            this.people[this.current_index] = attendee;
        }
    }

    // When a user clicks to add a new attendee, updates list of registers and create clean form
    createNewAttendee() {

        // If the form is valid, add attendee to people list, then set the current attendee the new person in people list
        if (this.attendeeForm.valid) {
            this.people.push(new Attendee('', '', '', '', null, '', '', '', '', '', '', '', '', '', '', '',
                '', '', '', 'Friday, Saturday, Sunday, Monday', null, '', '', false, ''));

            this.max_index++;
            this.current_index = this.max_index;

            // Fills in checkboxes to attend everyday
            this.attendeeForm.setControl('days', this.fb.array(this.days_bool));

            // Copy church info to every other register. save work for leaders
            this.people[this.max_index].your_church = this.your_church.value;
            this.people[this.max_index].your_church_point_of_contact_name = this.your_church_point_of_contact_name.value;
            this.people[this.max_index].your_church_point_of_contact_number = this.your_church_point_of_contact_number.value;

            // Update current attendee
            this.currentAttendee = this.people[this.max_index];

            // Make sure the last index should be deleted since we just added an empty object into people
            this.shouldSlice = true;

            // Bind to UI
            this.bindListToForm();
            this.your_churches.setValue('Other');

            // sScroll to top of page
            this.scroll();
        }
    }

    // Loads list of attendees from service.
    loadAttendees() {
        // Grabs attendees from the service
        const attendees = this.userService.getAllRegisters();

        // If attendees exist, loads attendees, otherwise create new attendee and add to people list
        if (attendees.length > 0) {
            this.people = attendees;

            // Updates indices to correct attendee.
            this.max_index = this.people.length - 1;
            this.current_index = this.max_index;

            this.currentAttendee = this.people[this.current_index];

            this.attendeeForm.reset();

            // Make sure the last index should not be deleted
            this.shouldSlice = false;

            // Puts attendee values to form after resetting.
            this.bindListToForm();

        } else {
            // Create new attendee and add to the current empty people list
            this.people.push(new Attendee('', '', '', '', null, '', '', '', '', '', '', '', '', '', '',
                '', '', '', '', '', null, '', '', false, ''));
            this.currentAttendee = this.people[0];
            this.max_index = 0;
            this.current_index = 0;
        }
    }

    // Must navigate to specific attendee and update active pagination
    loadAttendee(attendee: Attendee, new_index: number) {

        // Set new current attendee for active setting
        this.currentAttendee = attendee;

        // Pull in target attendee data and put into form
        this.bindListToForm();

        // Make sure to update days attending when switching
        this.rebindDaysCheck();

        // Updates current index to the attendee we're loading
        this.current_index = new_index;

        // Make sure the last index should not be deleted
        this.shouldSlice = false;
    }

    // Deletes attendee from current list
    deleteAttendee(index) {
        if (index >= 0) {

            // Deletes Attendee from list
            this.people.splice(index, 1);
            this.max_index--;

            // Resets current attendee and index to the first one
            this.current_index = index - 1;
            this.currentAttendee = this.people[this.current_index];
            this.bindListToForm();
        }
    }

    // Checks if Other or N/A church is selected
    checkChurch() {
        if (this.your_churches.value === 'N/A') {
            this.your_church.setValue('');
        } else if (!(this.your_churches.value === 'Other')) {
            this.your_church.setValue(this.your_churches.value);
        }

        // Makes sure the list is always set to what's in the Church Name box
        // If not, then is set to Other
        if (this.church_list.includes(this.your_church.value, 0)) {
            this.your_churches.setValue(this.your_church.value);
        }
        if (this.your_churches.value === '' || this.your_churches.value == null) {
            this.your_churches.setValue('Other');
        }
    }

    // Makes sure to set value of the days attending string based on the checked boxes
    numDaysCheck() {
        const dates = this.attendeeForm.get('days').value;

        this.cost = 170;
        this.days_attending = '';

        if (dates[0]) {
            this.days_attending += 'Friday, ';
        }
        if (dates[1]) {
            this.days_attending += 'Saturday, ';
        }
        if (dates[2]) {
            this.days_attending += 'Sunday, ';
        }
        if (dates[3]) {
            this.days_attending += 'Monday';
        }
    }

    // Checks if the days are binded properly.
    rebindDaysCheck() {
        this.attendeeForm.setControl('days', this.fb.array([
            this.currentAttendee.days_attending.includes('Friday'),
            this.currentAttendee.days_attending.includes('Saturday'),
            this.currentAttendee.days_attending.includes('Sunday'),
            this.currentAttendee.days_attending.includes('Monday')
        ]));
    }

    // Scrolls to top of page
    scroll() {
        const scrollToTop = window.setInterval(() => {
            const pos = window.pageYOffset;
            if (pos > 0) {
                // How far to scroll on each step
                window.scrollTo(0, pos - 40);
            } else {
                window.clearInterval(scrollToTop);
            }
        }, 16);
    }

    // Binding
    // Updates the form's values with the contents from the list
    bindListToForm() {
        this.checkChurch();
        this.first_name.setValue(this.currentAttendee.first_name);
        this.last_name.setValue(this.currentAttendee.last_name);
        this.t_shirt.setValue(this.currentAttendee.t_shirt);
        this.gender.setValue(this.currentAttendee.gender);
        this.age.setValue(this.currentAttendee.age);
        this.medical.setValue(this.currentAttendee.medical);
        this.address.setValue(this.currentAttendee.address);
        this.address_2.setValue(this.currentAttendee.address_2);
        this.city.setValue(this.currentAttendee.city);
        this.state.setValue(this.currentAttendee.state);
        this.zip_code.setValue(this.currentAttendee.zip_code);
        this.email.setValue(this.currentAttendee.email);
        this.emergency_contact_first_name.setValue(this.currentAttendee.emergency_contact_first_name);
        this.emergency_contact_last_name.setValue(this.currentAttendee.emergency_contact_last_name);
        this.emergency_contact_phone_number.setValue(this.currentAttendee.emergency_contact_phone_number);
        this.emergency_contact_relationship.setValue(this.currentAttendee.emergency_contact_relationship);
        this.your_church.setValue(this.currentAttendee.your_church);
        this.your_church_point_of_contact_name.setValue(this.currentAttendee.your_church_point_of_contact_name);
        this.your_church_point_of_contact_number.setValue(this.currentAttendee.your_church_point_of_contact_number);
        this.rebindDaysCheck();
    }

}
