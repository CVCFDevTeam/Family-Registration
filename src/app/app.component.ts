import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase';


const settings = {
    ssl: true,
    timestampsInSnapshots: true
};


const config = {
    apiKey: '<firebase api key>',
    authDomain: '<firebase auth domain>',
    databaseURL: '<firebase db url>',
    projectId: '<firebase project id>',
    storageBucket: '<firebase storage bucket>',
    messagingSenderId: '<firebase messaging sender id>'
};

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {

    titleOne = '<Title of the Registration Form>';
    titleTwo = '<Theme>';
    themeVerse = '<Theme verse>';
    themeVerseReference = '<Theme verse reference>';

    page = 'attendeesFormPage';

    constructor() {

    }

    ngOnInit() {
        firebase.initializeApp(config);
        firebase.firestore().settings(settings);
    }

    switchPage(page) {
        this.page = page;
    }
}
