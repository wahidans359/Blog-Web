import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../../services/auth-service';
import { CommonModule } from '@angular/common';
import { NotFoundError } from '@angular/core/primitives/di';

@Component({
  selector: 'app-navbar',
  imports: [RouterModule,CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  navLinks = [
    { label : 'Home', path: '/' },
    { label : 'Posts', path: '/posts' },
    { label : 'About', path: '/about' },
    { label : 'Contact', path: '/contact' },
  ]

  authLinks = [
    { label : 'Login', path: '/login' },
    { label : 'Signup', path: '/signup' }
  ]
  private authService = inject(AuthService);
  authState$ = this.authService.authState$;
  private router = inject(Router);

  logout() {
    // const currentUser = this.authService.authState
    console.log(this.authService.authState.getValue());
    const currentUser = this.authService.authState.getValue().user;
    if(!currentUser) {
      console.error('No user is currently logged in.');
      throw new NotFoundError('No user is currently logged in.');
    }
    this.authService.logout(currentUser._id).subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.error('Logout failed:', error);
      }
    });
  }
}
