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
  webtask_discount_url = 'Your-webtask-discount-URL';

  // Production URL
  // webtask_payment_url = 'Your-production-webtask-URL';
  // Test URL
  webtask_payment_url = 'Your-test-webtask-URL';


  // Generic variables
  registers: any;
  loading: boolean = false;
  email = '';

  // Cost calculation variables
  total_cost = 0;
  base_price = 155;
  original_cost = 0;
  new_cost = 165;
  cost_diff = 0;

  // Submit button disabled
  button_disabled = false;

  // Generic data object for incoming value from webtask.io
  dataObj: any;

  constructor(private cd: ChangeDetectorRef, private userService: UserService,
    private http: HttpClient,
    private router: Router,
    private fs: FirestoreService) { }

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
    } else {
      this.error = null;
    }
    this.cd.detectChanges();
  }

  async onSubmit(form: NgForm) {
    // Disable button when submitting form to prevent multiple submissions
    this.button_disabled = true;

    // Allows the user to submit without credit card info if cost is 0
    if (this.total_cost === 0) {
      this.postToDatabase().then(
        (success) => this.router.navigate(['/', 'thank-you']),
        (error) => console.error("Post to Database error", error)
      )
    }
    else {
      // Attempt to create stripe token from card information
      const { token, error } = await stripe.createToken(this.card);

      if (error) {
        // Reenables the button to allow the user to resubmit
        this.button_disabled = false;
      } else {
        // Send the token to the backend to process the charge
        this.processCharge(token).then(
          (success) => {
            this.postToDatabase().then(
              (success) => this.router.navigate(['/', 'thank-you']),
              (error) => console.error("Post to Database error", error)
            )
          },
          (error) => console.error("Stripe process charge error", error)
        );
      }
    }
  }

  // Processes charge through Webtask.io and Stripe
  processCharge(token) {
    let promise = new Promise((resolve, reject) => {
      const command = {
        amount: this.total_cost * 100,
        currency: 'usd',
        description: 'Registration cost for ' + this.email,
        source: token,
        receipt_email: this.email
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
  postToDatabase() {
    this.loading = true;

    //Fix cost for all registers
    for (var i in this.registers) {
      this.registers[i].cost = this.new_cost;
    }

    //google sheet response is html, but for some reason, http tries to parse json.
    //this project will reject the html. I think it has to do with http header.
    let promise = new Promise((resolve, reject) => {
      this.fs.postAttendees(this.registers)
        .subscribe(
          (data) => resolve(data),
          (err) => {
            console.log(err);
          })
    });

    return promise;
  }

  // Disables submit button after submit
  isDisabled() {
    return this.button_disabled;
  }

  // Updates registration cost based on discounts defined in Webtask.io
  checkDiscount(discount: string) {
    let promise = new Promise((resolve, reject) => {
      const command = {
        code: discount
      };

      this.http.post(this.webtask_discount_url, command).subscribe(
        (data) => {
          this.dataObj = data;
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
