import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { TokenService } from './token-service';
import { LoginCredentials } from '../interfaces/login-credentials';
import { AuthResponse } from '../interfaces/auth-response';
import { BehaviorSubject, catchError, Observable, tap, throwError } from 'rxjs';
import { SignupCredentials } from '../interfaces/signup-crendentials';
import { AuthState } from '../interfaces/auth-state';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private tokenService = inject(TokenService);
  private baseUrl = 'http://localhost:3000/auth';

  authState = new BehaviorSubject<AuthState>({
    isAuthenticated: this.tokenService.hasValidAccessToken(),
    user:undefined
  })

  authState$ = this.authState.asObservable(); //$ suffix indicates observable
  login(credentials: LoginCredentials) : Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/login`, credentials, {
      withCredentials: true
    }).pipe(
      tap(response => {
        if(!response?.accessToken) {
          throw new Error('Invalid login response: No access token provided');
        }
        this.tokenService.setTokens(response);
        this.authState.next({
          isAuthenticated: true,
          user: response.userData
        });
      }),
      catchError(this.handleError)
    );
  }

  private handleError(error : HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      // Client-side or network error
      errorMessage = `Error: ${error.error.message}`;
    } else if (error.error && error.error.message) {
      // Server-side error with a message
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Other server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(() => errorMessage);
  }
  isAuthenticated() : boolean {
    return this.tokenService.hasValidAccessToken();
  }

  signup(credentials: SignupCredentials) : Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/signup`, credentials ,{
      withCredentials: true
    }).pipe(
      tap(response => {
        this.tokenService.setTokens(response);
        this.authState.next({
          isAuthenticated: true,
          user: response.userData
        })
      })
    );
  }
  refreshToken() : Observable<AuthResponse> {
    const refreshToken = this.tokenService.getRefreshToken();
    return this.http.post<AuthResponse>(`${this.baseUrl}/refresh-token`, { refreshToken } , {
      withCredentials: true
    }).pipe(
      tap(response => {
        this.tokenService.setTokens(response);
        this.authState.next({
          isAuthenticated: true,
          user: response.userData
        })
      })
    );
  }
  logout(userId : string): Observable<void>{
    console.log('AuthService: Logging out user with ID:', userId);
    return this.http.post<void>(`${this.baseUrl}/logout`, {userId} , {
      withCredentials: true,
      headers: {
      'Content-Type': 'application/json'
    }
    }).pipe(
      tap(() => {
        this.tokenService.clearTokens();
        this.authState.next({
          isAuthenticated: false,
          user: undefined
        })
      })
    );
  }
  initializeAuthState() : void {
    this.checkAuthStatus();
  }
  checkAuthStatus() : void {
    const isAuth = this.tokenService.hasValidAccessToken();
    if(!isAuth) {
      this.authState.next({
        isAuthenticated: false,
        user: undefined
      })
    }
  }
}
