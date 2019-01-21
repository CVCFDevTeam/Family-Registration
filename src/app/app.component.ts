import { Component } from '@angular/core';
import * as firebase from 'firebase';
import firestore from 'firebase/firestore';

const settings = { 
  ssl: true,
  timestampsInSnapshots: true 
};
const config = {
  apiKey: "YOUR KEY",
  authDomain: "your-domain.firebaseapp.com",
  databaseURL: "https://your-database-url.firebaseio.com",
  projectId: "your-project-id",
  storageBucket: "your-storage-bucket.appspot.com",
  messagingSenderId: "your-messaging-sender-id"
};

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {

  titleOne = 'Camp Name and Year';
  titleTwo = 'Registration Form';
  page = 'attendeesFormPage';

  constructor(){

  }

  ngOnInit() {
    firebase.initializeApp(config);
    firebase.firestore().settings(settings);
  }

  switchPage(page){
    this.page = page;
  }
}
