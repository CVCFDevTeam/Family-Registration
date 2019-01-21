import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { AttendeeFormComponent } from './attendee-form/attendee-form.component';

import { HttpClientModule } from '@angular/common/http';
import { ReviewPageComponent } from './review-page/review-page.component';
import { ThankyoupageComponent } from './thankyoupage/thankyoupage.component';

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
    ThankyoupageComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule.forRoot(
      appRoutes
    )
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
