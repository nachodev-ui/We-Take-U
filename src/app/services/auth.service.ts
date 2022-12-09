/* eslint-disable no-trailing-spaces */
import { Injectable } from '@angular/core';

import * as auth from 'firebase/auth';
import { AngularFireAuth } from '@angular/fire/compat/auth';

import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FirebaseService } from './firebase.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private afAuth: AngularFireAuth,
    private router: Router,
    private firestoreService: FirebaseService
  ) { }

  /*Devolver la respuesta de la promesa*/
  login(email: string, password: string) {
   return this.afAuth.signInWithEmailAndPassword(email, password);
  }

  async accountVerification() {
    return await this.afAuth.currentUser.then(u => u?.sendEmailVerification());
  }

  authUserDisabled() {
    return this.afAuth.currentUser.then( user => {
      if(user) {
        return user.emailVerified;

      }
    });
  }

  googleLogin() {
    return this.afAuth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
  }

  githubLogin() {
    return this.afAuth.signInWithPopup(new firebase.auth.GithubAuthProvider());
  }

  logout() {
    this.afAuth.signOut();
  }

  /*Crea un nuevo usuario en el modulo de Authentication de Firestore*/
  registerUser(email: string, password: string) {
    return this.afAuth.createUserWithEmailAndPassword(email, password)
  }

  stateUser() {
    return this.afAuth.authState;
  }

  buscarEmail(email: string) {
    return this.afAuth.fetchSignInMethodsForEmail(email);
  }

  async sendRessetPasswordEmail(email: string) {
    return this.afAuth.sendPasswordResetEmail(email);
  }

  forgotPassword(email: string) {
    return this.afAuth.sendPasswordResetEmail(email);
  }

  /*Recoge el Uid de la base de datos*/
  async getUid() {

    /*Espera a devolver el usuario actual*/
    const user = await this.afAuth.currentUser;

    /*Retomamos el Uid*/
    if (user) {
      return user.uid;
    } else {
      return null;
    }

  }
  
  getCurrentUserEmail() {
    return this.afAuth.currentUser;
  }

  //SignIn and Save credentials with googleSignIn
  async googleSignIn() {
    let googleUser = await GoogleAuth.signIn();
    const credential = auth.GoogleAuthProvider.credential(googleUser.authentication.idToken);
    return this.afAuth.signInWithCredential(credential);
  }

}
