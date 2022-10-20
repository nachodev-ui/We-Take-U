import { Injectable } from '@angular/core';

import { AngularFirestore } from '@angular/fire/compat/firestore';

import { LoadingController, ToastController } from '@ionic/angular';
import { VehiculoI, ViajeI } from '../models/models';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  loadingAux: any;

  constructor(
    private database: AngularFirestore,
    private toastController: ToastController,
    private loadingController: LoadingController
  ) { }

  /* data = objeto, path = coleccion, id: id*/
  createDoc(data: string, path: string, id:string) {
    const collection = this.database.collection(path);
    return collection.doc(id).set(data);
  }

  addVehicle(vehicle: VehiculoI) {
    const id = this.database.createId();
    vehicle.uid = id;
    return this.database.collection('Vehiculos').doc(id).set(vehicle);
  }

  patenteYaExiste(patente: string) {
    const collection = this.database.collection('Vehiculos');
    return collection.ref.where('patente', '==', patente).get();
  }

  getDoc<tipo>(path: string, id: string) {
    const collection = this.database.collection<tipo>(path);
    return collection.doc(id).valueChanges();
  }

  updateDoc(path: string, id: string, data: any) {
    return this.database.collection(path).doc(id).update(data);
  }

  addDoc(data: any, path: string) {
    const collection = this.database.collection(path);
    return collection.add(data);
  }

  deleteDoc(path: string, id: string) {
    const collection = this.database.collection(path);
    return collection.doc(id).delete();
  }

  getId() {
    return this.database.createId();
  }

  getCollection<tipo>(path: string) {
    const collection = this.database.collection<tipo>(path);
    return collection.valueChanges();
  }

  saveViajeDetails(viaje: ViajeI) {
    const id = this.database.createId();
    viaje.uid = id;
    return this.database.collection('Viajes').doc(id).set(viaje);
  }

}
