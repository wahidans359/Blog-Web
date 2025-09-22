import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { NavbarComponent } from '../landing/navbar/navbar.component/navbar.component';
import { AuthService } from '../../services/auth-service';
import { SignupCredentials } from '../../interfaces/signup-crendentials';
import {ToastrService} from 'ngx-toastr';
import { trigger, transition, style, animate } from '@angular/animations';
@Component({
  selector: 'app-auth',
  templateUrl: './auth.html',
  styleUrls: ['./auth.scss'],
  imports: [FormsModule, RouterModule, NavbarComponent],
  animations: [
    trigger('flyInOut', [
      transition(':enter', [
        style({ transform: 'translateY(-20px)', opacity: 0 }),
        animate('300ms ease-out', style({ transform: 'translateY(0)', opacity: 1 }))
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({ transform: 'translateY(-20px)', opacity: 0 }))
      ])
    ])
  ]
})
export class Auth implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);
  private toastr = inject(ToastrService)
  constructor(
    private route: ActivatedRoute
  ) {}

  activeTab: 'login' | 'signup' = 'login';
  isLoading = false;
  errorMessage = '';
  loginForm = {
    email: '',
    password: ''
  };

  signupForm = {
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  };
  passwordError = '';
  showPassword = {
    login:false,
    signup:false,
    confirmPassword: false
  }
  togglePasswordVisibility(form: 'login' | 'signup' | 'confirmPassword' ) {
    this.showPassword[form] = !this.showPassword[form];
  }
  ngOnInit() {
    // Set initial tab based on current route
    const currentPath = this.route.snapshot.url[0]?.path;
    this.activeTab = currentPath === 'signup' ? 'signup' : 'login';
  }

  navigateToTab(tab: 'login' | 'signup') {
    this.activeTab = tab;
    this.errorMessage = '';
    this.router.navigate([tab === 'login' ? '/login' : '/signup']);
  }

  async onLogin() {
    // console.log('Login form submitted', this.loginForm);
    // Add your login logic here
    this.isLoading = true;
    this.errorMessage = '';

    this.authService.login(this.loginForm).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.toastr.success('Login successful', 'Welcome back!');
        this.router.navigate(['/posts']);
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error?.error?.message || 'An error occurred during login.';
        this.toastr.error(this.errorMessage, 'Error');
      },
      complete: () => {
        this.isLoading = false;
        console.log('Login request completed');
      }
    })
  }

  onSignup() {
    this.isLoading = false;
    this.errorMessage = '';
    this.passwordError = '';
    
    if (this.signupForm.password !== this.signupForm.confirmPassword) {
      this.passwordError = 'Passwords do not match';
      this.isLoading = false;
      return;
    }
    const {confirmPassword, ...signupData} = this.signupForm;
    this.authService.signup(signupData as SignupCredentials ).subscribe({
      next : (response) => {
        this.isLoading = false;
        this.toastr.success('Account created successfully', 'Welcome!');
        this.router.navigate(['/posts']);
      },
      error : (error) => {
        this.isLoading = false;
        this.errorMessage = error?.error?.message || 'An error occurred during signup.';
        this.toastr.error(this.errorMessage, 'Signup Failed');
      },
      complete : () => {
        this.isLoading = false;
        console.log('Signup request completed');
      }
    })
  }
}