/* eslint-disable no-trailing-spaces */
import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { UserI } from 'src/app/models/models';
import { AuthService } from 'src/app/services/auth.service';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {

  /*Inicializar el uid como null*/
  uid: string = null;

  /*Variable para desplegar info*/
  infoUser: UserI = null;

  constructor(
    private authService: AuthService,
    private database: FirebaseService,
    private alertCtrl: AlertController
    ) { }

  async ngOnInit() {

    this.authService.stateUser().subscribe( res => {
      this.getUid();
    });

  }

  async getUid() {
    const uid = await this.authService.getUid();

    if (uid) {
      this.uid = uid;

      this.getInfoUser();

    } else {
      this.uid = null;
    }
  }

  async editProfile() {
    const alert = await this.alertCtrl.create({
      header: 'Editar Perfil',
      mode: 'ios',
      inputs: [
        {
          name: 'direccion',
          type: 'text',
          placeholder: 'Agrega una dirección'
        },
        {
          name: 'phone',
          type: 'number',
          placeholder: 'Teléfono',
          value: this.infoUser.celular
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: ()=> {
            console.log('Cancelar');
          }
        },
        {
          text: 'Aceptar',
          handler: (ev) => {
            this.savePhone(ev.phone);
            this.addDirection(ev.direccion);
          }
        },
      ]
    });

    await alert.present();
  }

  async editImage() {
    const alert = await this.alertCtrl.create({
      header: 'Agregar imagen',
      mode: 'ios',
      inputs: [
        {
          name: 'imagen',
          type: 'text',
          placeholder: 'Agrega una dirección de imagen'
        },
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: ()=> {
            console.log('Cancelar');
          }
        },
        {
          text: 'Aceptar',
          handler: (ev) => {
            this.uploadPhoto(ev.imagen);
          }
        },
      ]
    });

    await alert.present();
  }

  async userUpdated() {
    const alert = await this.alertCtrl.create({
      mode: 'ios',
      header: 'Su perfil ha sido actualizado',
      buttons: ['Aceptar']
    });

    await alert.present();
  }

  /*Tomar los datos del usuario autenticado*/
  getInfoUser() {
    const path = 'Usuarios';
    const id = this.uid;

    this.database.getDoc<UserI>(path, id).subscribe( credentials => {
      if (credentials) {
        this.infoUser = credentials;
      }
    });

  }

  /*Metodos de modificacion de datos*/
  savePhone(celularInput: string) {
    const path = 'Usuarios';
    const id = this.uid;

    const updateDoc = {
      celular: celularInput
    };

    this.database.updateDoc(path, id, updateDoc).then (  () => {
      this.userUpdated();
    });

  }

  addDirection(direccionInput: string) {
    const path = 'Usuarios';
    const id = this.uid;

    const updateDoc = {
      direccion: direccionInput
    };

    this.database.updateDoc(path, id, updateDoc).then (  () => {
      this.userUpdated();
    });
  }

  uploadPhoto(imgInput: string) {
    const path = 'Usuarios';
    const id = this.uid;

    const updateDoc = {
      imagen: imgInput
    };

    this.database.updateDoc(path, id, updateDoc).then (  () => {
      this.userUpdated();
    });
  }

}
