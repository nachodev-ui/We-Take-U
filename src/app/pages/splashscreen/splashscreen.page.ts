import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-splashscreen',
  templateUrl: './splashscreen.page.html',
  styleUrls: ['./splashscreen.page.scss'],
})
export class SplashscreenPage implements OnInit {

  constructor(private router : Router) {
    setTimeout(() => {
      this.router.navigateByUrl('/home');
    }, /*5000*/);
   }

  ngOnInit() {

  }

}
