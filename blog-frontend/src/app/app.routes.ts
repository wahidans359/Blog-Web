import { Routes } from '@angular/router';
import { Auth } from './components/auth/auth';
import { Landing } from './components/landing/landing';
export const routes: Routes = [
    {path:'',component:Landing},
    {path : 'auth', component : Auth},
    {path : 'login', component : Auth},
    {path : 'signup', component : Auth},
];
