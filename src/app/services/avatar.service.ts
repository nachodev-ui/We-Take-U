import { Injectable } from '@angular/core';

import { doc, docData, Firestore } from '@angular/fire/firestore';

import { Auth } from '@angular/fire/auth';
import { ref, Storage, uploadString } from '@angular/fire/storage';
import { Photo } from '@capacitor/camera';
import { getDownloadURL } from 'firebase/storage';
import { setDoc } from 'firebase/firestore';
import { FirebaseService } from './firebase.service';
import { UserI } from '../models/models';

@Injectable({
  providedIn: 'root'
})
export class AvatarService {

  infoUser: null;

  constructor(
    private auth: Auth,
    private firestore: Firestore,
    private storage: Storage,
    private fbase: FirebaseService
  ) { }

  getUserProfile() {
    const user = this.auth.currentUser;
    const userDocRef = doc(this.firestore, `Usuarios/${user.uid}`);
    return docData(userDocRef);
  }

  async uploadImage(cameraFile: Photo) {
    const user = this.auth.currentUser;
    const path = `Uploads/${user.uid}/profile.png`;
    const storageRef = ref(this.storage, path);

    try {
      await uploadString(storageRef, cameraFile.base64String, 'base64');

      const imageUrl = await getDownloadURL(storageRef);
      const userDocRef = doc(this.firestore, `Usuarios/${user.uid}`);
      this.fbase.getCollection<UserI>('Usuarios');
      {
        setDoc(userDocRef, { photoURL: imageUrl }, { merge: true });
        return true;
      }

    } catch(e) {
      return null;
    }
  }

}
