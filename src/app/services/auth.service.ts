/* eslint-disable no-trailing-spaces */
import { Injectable } from '@angular/core';

import { AngularFireAuth } from '@angular/fire/compat/auth';

import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private authfire: AngularFireAuth
  ) { }

  /*Devolver la respuesta de la promesa*/
  login(email: string, password: string) {
   return this.authfire.signInWithEmailAndPassword(email, password);
  }

  async accountVerification() {
    return await this.authfire.currentUser.then(u => u?.sendEmailVerification());
  }

  authUserDisabled() {
    return this.authfire.currentUser.then( user => {
      if(user) {
        return user.emailVerified;

      }
    });
  }

  googleLogin() {
    return this.authfire.signInWithPopup(new firebase.auth.GoogleAuthProvider());
  }

  githubLogin() {
    return this.authfire.signInWithPopup(new firebase.auth.GithubAuthProvider());
  }

  logout() {
    this.authfire.signOut();
  }

  /*Crea un nuevo usuario en el modulo de Authentication de Firestore*/
  registerUser(email: string, password: string) {
    return this.authfire.createUserWithEmailAndPassword(email, password)
  }

  stateUser() {
    return this.authfire.authState;
  }

  buscarEmail(email: string) {
    return this.authfire.fetchSignInMethodsForEmail(email);
  }

  async sendRessetPasswordEmail(email: string) {
    return this.authfire.sendPasswordResetEmail(email);
  }

  forgotPassword(email: string) {
    return this.authfire.sendPasswordResetEmail(email);
  }

  /*Recoge el Uid de la base de datos*/
  async getUid() {

    /*Espera a devolver el usuario actual*/
    const user = await this.authfire.currentUser;

    /*Retomamos el Uid*/
    if (user) {
      return user.uid;
    } else {
      return null;
    }

  }

  getCurrentUserEmail() {
    return this.authfire.currentUser;
  }

}
