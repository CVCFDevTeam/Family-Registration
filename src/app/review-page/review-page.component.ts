import {
    Component, OnInit,
    AfterViewInit,
    OnDestroy,
    ViewChild,
    ElementRef,
    ChangeDetectorRef,
    EventEmitter, Output
} from '@angular/core';

import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';

import { UserService } from '../services/user.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { FirestoreService } from '../services/firestore.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-review-page',
    templateUrl: './review-page.component.html'
})

export class ReviewPageComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild('cardInfo') cardInfo: ElementRef;

    @Output() completed = new EventEmitter<string>();

    // Card variables pertaining to Stripe
    card: any;
    cardHandler = this.onChange.bind(this);
    error: string;

    // Web Task URLs
    webtask_discount_url = '<webtask discount url>';

    // Production URL
    // webtask_payment_url = '<prod webtask payment url>';
    // Test URL
    webtask_payment_url = '<test webtask payment url>';


    // Generic variables
    registers: any;
    email = '';
    discount: string;

    // Cost calculation variables
    total_cost = 0;
    base_price = 20000000; // Insert camp cost here
    original_cost = 0;
    new_cost = 2000000; // Insert camp cost here
    cost_diff = 0;

    // Submit button disabled
    button_disabled = false;
    discountIncorrect = false;

    // Generic data object for incoming value from webtask.io
    dataObj: any;

    constructor(private cd: ChangeDetectorRef, private userService: UserService,
        private http: HttpClient,
        private router: Router,
        private fs: FirestoreService,
        private spinner: NgxSpinnerService,
        private toastr: ToastrService) { }

    ngOnInit() {
        // Get data from form registrations
        this.registers = this.userService.getAllRegisters();

        // Scrolls to top of screen
        window.scrollTo(0, 0);

        // Calculates total for registers
        this.total_cost = this.registers.length * this.base_price;
        this.original_cost = this.registers.length * this.base_price;

        this.button_disabled = false;
    }

    ngAfterViewInit() {
        // TODO: Move this to a proper styles page
        const style = {
            base: {
                lineHeight: '24px',
                fontFamily: 'monospace',
                fontSmoothing: 'antialiased',
                fontSize: '19px',
                '::placeholder': {
                    color: 'purple'
                }
            }
        };

        // Create Stripe card element
        this.card = elements.create('card');
        this.card.mount(this.cardInfo.nativeElement);

        this.card.addEventListener('change', this.cardHandler);
    }

    ngOnDestroy() {
        this.card.removeEventListener('change', this.cardHandler);
        this.card.destroy();
    }

    onChange({ error }) {
        if (error) {
            this.error = error.message;
            this.button_disabled = true;
        } else {
            this.error = null;
            this.button_disabled = false;
        }
        this.cd.detectChanges();
    }

    async onSubmit(form: NgForm) {
        // Disable button when submitting form to prevent multiple submissions
        this.button_disabled = true;
        this.spinner.show();

        if (this.registers.length !== 0) {
            // Allows the user to submit without credit card info if cost is 0
            if (this.total_cost === 0) {
                this.registers.forEach(attendee => {
                    attendee.paid_status = 'Still Needs To Pay';
                });
                this.spinner.hide();
                this.postToDatabase(false).then(
                    (success) => {
                        this.postToDatabase(true).then(
                            () => {
                                this.spinner.hide();
                                this.router.navigate(['/', 'thank-you']);
                            },
                            (error) => {
                                this.spinner.hide();
                                console.error('Post to Database error', error);
                                this.toastr.error('There was an error saving your information', 'Database Error');
                            }
                        );
                    },
                    (error) => {
                        console.error('Post to Database error', error);
                        this.spinner.hide();
                        this.toastr.error('There was an error saving your information', 'Database Error');
                    });
            } else {
                // Attempt to create stripe token from card information
                const { token, error } = await stripe.createToken(this.card);

                if (error) {
                    // Reenables the button to allow the user to resubmit
                    this.button_disabled = false;
                    this.spinner.hide();
                    this.toastr.error('There was an error with processing your payment', 'Token Error');
                } else {
                    this.registers.forEach(attendee => {
                        attendee.paid_status = 'Fully Paid';
                    });

                    this.postToDatabase(false).then(
                        () => {
                            // Send the token to the backend to process the charge
                            this.processCharge(token).then(
                                () => {
                                    this.postToDatabase(true).then(
                                        () => {
                                            this.spinner.hide();
                                            this.router.navigate(['/', 'thank-you']);
                                        },
                                        (errorToDB) => {
                                            console.error('Post to Database error', errorToDB);
                                            this.spinner.hide();
                                            this.toastr.error('There was an error saving your information', 'Database Error');
                                        }
                                    );
                                },
                                (errorToCharge) => {
                                    console.error('Stripe process charge error', errorToCharge);
                                    this.spinner.hide();
                                    this.toastr.error('There was an error with processing your payment', 'Stripe Error');
                                }
                            );
                        },
                        (errorToBackup) => {
                            console.error('Post to Database error', errorToBackup);
                            this.spinner.hide();
                            this.toastr.error('There was an error saving your information', 'Database Error');
                        });
                }
            }
        } else {
            this.spinner.hide();
        }
    }

    // Processes charge through Webtask.io and Stripe
    processCharge(token) {
        const promise = new Promise((resolve, reject) => {
            const command = {
                amount: this.total_cost * 100,
                currency: 'usd',
                description: 'Registration cost for ' + this.email.trim(),
                source: token,
                receipt_email: this.email.trim()
            };

            this.http.post(this.webtask_payment_url, command).subscribe(
                (data) => resolve(data),
                (error) => reject(error)
            );
        });

        return promise;
    }

    // Monitor email value and set it here.
    onKey(value: string) {
        this.email = value;
    }

    // Post list of registers to Firebase connected to Firestore
    postToDatabase(postToMainDB: boolean) {
        let promise: any;

        // Fix cost for all registers
        this.registers.forEach(attendee => {
            attendee.cost = this.new_cost;
            attendee.discount = this.discount;
            attendee.checked_in = false;
            attendee.time_registered = new Date().toString();
        });


        if (postToMainDB) {
            promise = new Promise((resolve, reject) => {
                this.fs.postAttendees(this.registers)
                    .subscribe(
                        (data) => resolve(data),
                        (err) => {
                            console.log(err);
                        });
            });
        } else {
            promise = new Promise((resolve, reject) => {
                this.fs.postAttendeesToBackup(this.registers)
                    .subscribe(
                        (data) => resolve(data),
                        (err) => {
                            console.log(err);
                        });
            });
        }

        return promise;
    }

    // Updates registration cost based on discounts defined in Webtask.io
    checkDiscount() {
        const promise = new Promise((resolve, reject) => {
            const command = {
                code: this.discount
            };

            this.http.post(this.webtask_discount_url, command).subscribe(
                (data) => {
                    this.dataObj = data;
                    if (this.dataObj.newCost === this.base_price && this.discount !== '' && this.discount !== null) {
                        this.button_disabled = true;
                        this.discountIncorrect = true;
                    } else {
                        this.discountIncorrect = false;
                        this.button_disabled = false;
                    }
                    this.new_cost = this.dataObj.newCost;
                    this.total_cost = this.dataObj.newCost * this.registers.length;
                    this.original_cost = this.base_price * this.registers.length;
                    this.cost_diff = this.original_cost - this.total_cost;
                },
                (error) => reject(error)
            );
        });
    }
}
