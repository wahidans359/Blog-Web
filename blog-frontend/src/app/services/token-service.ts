import { Injectable } from '@angular/core';
import { AuthResponse } from '../interfaces/auth-response';

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  private readonly ACCESS_TOKEN_KEY = 'accessToken';
  private readonly REFRESH_TOKEN_KEY = 'refreshToken';

  setTokens(tokens:AuthResponse) : void{
    localStorage.setItem(this.ACCESS_TOKEN_KEY , tokens.accessToken);
    localStorage.setItem(this.REFRESH_TOKEN_KEY, tokens.refreshToken);
  }

  getAccessToken() : string | null {
    return localStorage.getItem(this.ACCESS_TOKEN_KEY);
  }
  getRefreshToken() : string | null {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }
  hasValidAccessToken() : boolean {
    const token = this.getAccessToken();
    if(!token)
        return false;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expiry = payload.exp * 1000; //To milliseconds
      return expiry > Date.now();
    } catch {
      return false;
    }
  }
  clearTokens() : void {
    localStorage.removeItem(this.ACCESS_TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
  }
}
