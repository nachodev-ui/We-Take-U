import { Injectable } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class CodeErrorService {

  constructor(
    private translate: TranslateService
  ) { }

  stringError(code: string) {
    switch (code) {

      case 'auth/invalid-email':
        return this.translate.instant('LOGIN.CODERR.invemail');

      case 'auth/user-not-found':
        return this.translate.instant('LOGIN.CODERR.notfound');

      case 'auth/wrong-password':
        return this.translate.instant('LOGIN.CODERR.wrongpass');

      case 'auth/email-already-in-use':
        return this.translate.instant('LOGIN.CODERR.alreadyuse');

    }
  }

}
