import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as firebase from 'firebase';
import firestore from 'firebase/firestore'
import { Attendee } from '../models/Attendee';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  collection = firebase.firestore().collection('attendees');

  constructor() { }

  postAttendees(data): Observable<any> {
    return new Observable((observer) => {
      data.forEach(x => {
        this.collection.add(JSON.parse(JSON.stringify(x))).then((doc) => {
          observer.next({
            key: doc.id,
          });
        });
      })
      
    });
  }

}
