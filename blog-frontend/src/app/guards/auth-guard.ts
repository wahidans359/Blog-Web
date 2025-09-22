import { inject } from "@angular/core";
import { AuthService } from "../services/auth-service"
import { Router } from "@angular/router";

export const authGuard = () => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if(authService.authState.getValue().isAuthenticated) {
        router.navigate(['/posts']);
        return false;
    }
    return true;
}

export const protectGuard = () => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if(!authService.authState.getValue().isAuthenticated) {
        router.navigate(['/login']);
        return false;
    }
    return true;
}