import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CodeErrorService {

  constructor() { }

  stringError(code: string) {
    switch (code) {

      case 'auth/invalid-email':
        return 'El correo electrónico ingresado no es válido.'

      case 'auth/user-not-found':
        return 'Usuario no encontrado';

      case 'auth/wrong-password':
        return 'Contraseña incorrecta';

      case 'auth/email-already-in-use':
        return 'El correo electrónico ya está en uso';

    }
  }

}
