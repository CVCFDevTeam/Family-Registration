# CVCF Custom Registration Form

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 6.0.3.

## Purpose

This custom registration form was created to service Christian camp registrations. (Though, anyone is free to use it!). Please just credit the CVCF organization as the source of the registration application.

## Setup

Make sure to have the following:
1. A Webtask.io account to handle serverless backend processing.
2. A Stripe account to process the charges being made through the form.
3. A Firebase Firecloud to post data to.

Here's a big list of things you'll have to rename/add/comment out:
1. src/app/app.component.html

   Line 8: Add a link to your camp logo, or comment out this line.  
   Line 10: Add your theme verse.  

2. src/app/app.component.ts

   Line 9: Add your firestore/firebase config information to the config variable.  
   Line 24: Add your Camp Title and Year.  

3. src/app/attendee-form/attendee-form.component.html

   Line 9: Add your Org's Facebook link.  
   Line 14: Add your Org's Website link.  
   Line 15: Add your Org's name.  
   Line 37 (Optional, for testing): Uncomment out the button for easy testing of the app's code.  

4. src/app/attendee-form/attendee-form.component.ts

   Line 68: Add list of churches that commonly attend your camp.  

5. src/app/review-page/review-page.component.ts

   Line 35: Add in your discount URL from Webtask.io.  
   Line 38: Add your production URL from Webtask.io.  
   Line 40: Add your test URL from Webtask.io.  

6. src/app/thankyoupage/thankyoupage.component.html

   Line 9: Add contact email.  
   Line 16: Add your Org's Facebook link.  
   Line 21: Add your Org's Website link.  
   Line 22: Add your Org's name.  

7. src/index.html

   Line 7: Add your Camp Name into the title.  
   Line 20: Add your publishable live key from Stripe API.  
   Line 21: Add your publishable test key from Stripe API.  

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Backend serverless Stripe processing

This code uses `webtask.io` to process Stripe payments as a serverless solution. 

## Payment System

We use Stripe as our payment processor. By using the Stripe Elements module, we can create a unique token to be sent to our serverless backend to handle the validity of the charge.

## Future Plans

We've set up a Firestore Service which contains our attendee information. We are currently setting up another application that will be a visual representation of the data in the database while also have the ability to manipulate the data in the form of a table with CRUD operations.

## Switching Between Prod and Dev Sites

To switch between dev and prod sites, please change the following values:
1. The publishable Stripe key in index.html
2. The webtask Payment URL in review-page.component.ts
3. Potentially the Firestore config information in app.component.ts

## Setting up on Github Pages

To host the code on your Github Pages site, run `ng build` to build the project. Look inside the `dist` folder near the root of the project and 
navigate into custom-registration-form. Copy all files in that folder and add/replace it in your Github Pages repo folder. Make sure not to delete
your .git folder like I've done multiple times this process.

## Current issues

Because this is a Single Page Application, hosting on Github Pages causes the website to be unable to navigate to the different "pages" currently via
the URL. Users must always navigate to the base url of the Github Pages site for it to work. Hopefully we can resolve this in the future.

## Test Our Version

Feel free to navigate to https://johnlha.github.io to see our current design in action. 

For test payment, use: 
1. card number: 4242 4242 4242 4242
2. card expiration date: any valid date past the current date
3. card cvc: any 3-digit value should work
4. email: any email, real or fake, should do.

Of course you won't be able to see the data saved to our Firestore Database, but if you're able to submit the fake payment and navigate to the Thank You Page, then it worked!
