import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { NavbarComponent } from '../landing/navbar/navbar.component/navbar.component';
import { AuthService } from '../../services/auth-service';
import { SignupCredentials } from '../../interfaces/signup-crendentials';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.html',
  styleUrls: ['./auth.scss'],
  imports: [FormsModule, RouterModule, NavbarComponent]
})
export class Auth implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);
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
        this.router.navigate(['/']);
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error?.error?.message || 'An error occurred during login.';
        console.error('Login error:', error);
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
    console.log('Signup form submitted', this.signupForm);
    const {confirmPassword, ...signupData} = this.signupForm;
    this.authService.signup(signupData as SignupCredentials ).subscribe({
      next : (response) => {
        this.isLoading = false;
        this.router.navigate(['/']);
      },
      error : (error) => {
        this.isLoading = false;
        this.errorMessage = error?.error?.message || 'An error occurred during signup.';
        console.error('Signup error:', error);
      },
      complete : () => {
        this.isLoading = false;
        console.log('Signup request completed');
      }
    })
  }
}