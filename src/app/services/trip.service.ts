import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

import { } from 'googlemaps';

@Injectable({
  providedIn: 'root'
})
export class TripService {

  constructor(
    private db: AngularFirestore,
  ) { }

  // Viaje by id

  getTrip(id: string) {
    return this.db.collection('Viajes').doc(id).valueChanges();
  }

}
