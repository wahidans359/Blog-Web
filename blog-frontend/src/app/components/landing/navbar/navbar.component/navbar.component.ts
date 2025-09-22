import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../../services/auth-service';
import { CommonModule } from '@angular/common';
import { NotFoundError } from '@angular/core/primitives/di';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-navbar',
  imports: [RouterModule,CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  isMenuOpen = false;
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

  createPostLink = {
    label: 'Create Post',
    path: '/posts/create',
    icon: 'fa-plus'
  }
  private authService = inject(AuthService);
  authState$ = this.authService.authState$;
  toastrService = inject(ToastrService)
  private router = inject(Router);


  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }
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

        this.toastrService.success('Logged out successfully', 'Success');
        this.router.navigate(['/login']);
      },
      error: (error) => {
        this.toastrService.error('Logout failed. Please try again.', 'Error');
        console.error('Logout failed:', error);
      }
    });
  }
}
