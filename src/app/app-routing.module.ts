import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'splashscreen',
    loadChildren: () => import('./pages/splashscreen/splashscreen.module').then( m => m.SplashscreenPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'registro',
    loadChildren: () => import('./pages/registro/registro.module').then( m => m.RegistroPageModule)
  },
  {
    path: 'reset-password',
    loadChildren: () => import('./pages/reset-password/reset-password.module').then( m => m.ResetPasswordPageModule)
  },
  {
    path: 'interfaz',
    loadChildren: () => import('./pages/interfaz/interfaz.module').then( m => m.InterfazPageModule)
  },
  {
    path: 'pasajero-viajes',
    children: [
      {
        path: '',
        loadChildren: () => import('./pages/interfaz/pasajero-viajes/pasajero-viajes.module').then( m => m.PasajeroViajesPageModule)
      },
      {
        path: ':id',
        loadChildren: () => import('./pages/interfaz/pasajero-viajes/viaje-activo/viaje-activo.module').then( m => m.ViajeActivoPageModule)
      }
    ]
  },
  {
    path: 'perfil',
    loadChildren: () => import('./pages/interfaz/perfil/perfil.module').then( m => m.PerfilPageModule)
  },
  {
    path: 'api-test',
    loadChildren: () => import('./pages/api-test/api-test.module').then( m => m.ApiTestPageModule)
  },
  {
    path: 'googlemaps',
    loadChildren: () => import('./pages/googlemaps/googlemaps.module').then( m => m.GooglemapsPageModule)
  },
  {
    path: 'registro-conductor',
    loadChildren: () => import('./pages/registro-conductor/registro-conductor.module').then( m => m.RegistroConductorPageModule)
  },
  {
    path: 'info-vehiculo',
    loadChildren: () => import('./pages/info-vehiculo/info-vehiculo.module').then( m => m.InfoVehiculoPageModule)
  },
  {
    path: 'verificate',
    loadChildren: () => import('./pages/verificate/verificate.module').then( m => m.VerificatePageModule)
  },
  {
    path: 'c-modal',
    loadChildren: () => import('./pages/c-modal/c-modal.module').then( m => m.CModalPageModule)
  },
  {
    path: 'verificate-conductor',
    loadChildren: () => import('./pages/verificate-conductor/verificate-conductor.module').then( m => m.VerificateConductorPageModule)
  },
  {
    path: 'language-popover',
    loadChildren: () => import('./pages/language-popover/language-popover.module').then( m => m.LanguagePopoverPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
