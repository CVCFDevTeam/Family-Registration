import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { AttendeeFormComponent } from './attendee-form/attendee-form.component';

import { HttpClientModule } from '@angular/common/http';
import { ReviewPageComponent } from './review-page/review-page.component';
import { ThankyoupageComponent } from './thankyoupage/thankyoupage.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PhoneMaskDirective } from './phone-mask.directive';

const appRoutes: Routes = [
    { path: 'form', component: AttendeeFormComponent },
    { path: 'review', component: ReviewPageComponent },
    { path: 'thank-you', component: ThankyoupageComponent },
    { path: '', redirectTo: '/form', pathMatch: 'full' },
    { path: '**', component: AttendeeFormComponent }
];

@NgModule({
    declarations: [
        AppComponent,
        AttendeeFormComponent,
        ReviewPageComponent,
        ThankyoupageComponent,
        PhoneMaskDirective
    ],
    exports: [
        PhoneMaskDirective
    ],
    imports: [
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        BrowserAnimationsModule,
        NgxSpinnerModule,
        ToastrModule.forRoot({
            timeOut: 7000,
            positionClass: 'toast-top-center',
            preventDuplicates: true
        }
        ),
        RouterModule.forRoot(
            appRoutes
        )
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
