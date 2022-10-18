import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';

import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AlertController, NavController } from '@ionic/angular';

import { AuthService } from 'src/app/services/auth.service';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-verify',
  templateUrl: './verify.page.html',
  styleUrls: ['./verify.page.scss'],
})
export class VerifyPage implements OnInit {
  formularioReset: FormGroup;

  constructor(
    private router: Router,
    public builder: FormBuilder,
    public alert: AlertController,
    public navCtrl: NavController,
    private authService: AuthService,
    private dataFire: FirebaseService
    ) {
      this.formularioReset = this.builder.group({
        'email': new FormControl('', Validators.required),
      });
  }

  ngOnInit() {
  }

  confirmMail() {
    console.log('Send email');
    
  }

  backToLogin(){
    this.navCtrl.navigateBack('/login');
  }

}
