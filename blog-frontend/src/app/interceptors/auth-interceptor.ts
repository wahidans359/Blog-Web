import { HttpErrorResponse, HttpInterceptorFn } from "@angular/common/http";
import { TokenService } from "../services/token-service";
import { inject } from "@angular/core";
import { AuthService } from "../services/auth-service";
import { catchError, switchMap } from "rxjs/operators";
import { throwError } from "rxjs";

export const authInterceptor : HttpInterceptorFn = (request, next) => {
    const tokenService = inject(TokenService);
    const authService = inject(AuthService);

    const accessToken = tokenService.getAccessToken();
    
    if(request.url.includes('/auth/login') || request.url.includes('/auth/signup') || request.url.includes('/auth/refresh')) {
        return next(request);
    }

    if(accessToken) {
        const authRequest = request.clone({
            headers : request.headers.set('Authorization', `Bearer ${accessToken}`)
        })
        return next(authRequest);
    }
    return next(request);
    // if(!accessToken) {
    //     throw new Error('No access token found');
    // }
    // req = req.clone({
    //     setHeaders: {
    //         Authorization: `Bearer ${accessToken}`
    //     }
    // });
    // return next(req).pipe(
    //     catchError((error: HttpErrorResponse) => {
    //         if (error.status === 401 && tokenService.getRefreshToken()) {
    //             return authService.refreshToken().pipe(
    //                 // Retry the failed request with the new access token
    //                 switchMap((tokens) => {
    //                     const clonedReq = req.clone({
    //                         setHeaders: {
    //                             Authorization: `Bearer ${tokens.accessToken}`
    //                         }
    //                     });
    //                     return next(clonedReq);
    //                 })
    //             );
    //         }
    //         // Rethrow the error if not handled above
    //         return throwError(() => error);
    //     }
    // ))
}