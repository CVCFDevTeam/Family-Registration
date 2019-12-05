import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as firebase from 'firebase';
import firestore from 'firebase/firestore';
import { Attendee } from '../Models/Attendee';

@Injectable({
    providedIn: 'root'
})
export class FirestoreService {

    collection = firebase.firestore().collection('<CollectionName>');
    backupCollection = firebase.firestore().collection('<BackupCollectionName>');

    constructor() { }

    postAttendees(data): Observable<any> {
        return new Observable((observer) => {
            data.forEach(x => {
                this.collection.add(JSON.parse(JSON.stringify(x))).then((doc) => {
                    observer.next({
                        key: doc.id,
                    });
                });
            });
        });
    }

    postAttendeesToBackup(data): Observable<any> {
        return new Observable((observer) => {
            data.forEach(x => {
                this.backupCollection.add(JSON.parse(JSON.stringify(x))).then((doc) => {
                    observer.next({
                        key: doc.id,
                    });
                });
            });
        });
    }

}
