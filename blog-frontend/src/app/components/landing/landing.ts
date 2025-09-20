import { Component } from '@angular/core';
import { MiddleComponent } from './middle/middle.component/middle.component';
import { NavbarComponent } from './navbar/navbar.component/navbar.component';

@Component({
  selector: 'app-landing',
  imports: [MiddleComponent,NavbarComponent],
  templateUrl: './landing.html',
  styleUrl: './landing.scss'
})
export class Landing {

}
