import { Injectable } from '@angular/core';
import {
  HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse
} from '@angular/common/http';
import { Observable, catchError, switchMap, throwError } from 'rxjs';
import { UserService } from 'src/app/services/user/user.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private isRefreshing = false;

  constructor(private userService: UserService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const accessToken = localStorage.getItem('accessToken');

    let authReq = req;
    if (accessToken) {
      authReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${accessToken}`
        }
      });
    }

    return next.handle(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        // Token expired — try to refresh
        if (error.status === 401 && !this.isRefreshing) {
          this.isRefreshing = true;

          const refreshToken = localStorage.getItem('refreshToken');
          if (refreshToken) {
            return this.userService.refreshToken(refreshToken).pipe(
              switchMap((res: any) => {
                this.isRefreshing = false;
                // Save new token
                localStorage.setItem('accessToken', res.data.accessToken);

                // Retry original request with new token
                const retryReq = req.clone({
                  setHeaders: {
                    Authorization: `Bearer ${res.data.accessToken}`
                  }
                });

                return next.handle(retryReq);
              }),
              catchError(refreshError => {
                this.isRefreshing = false;
                localStorage.clear(); // Logout user
                return throwError(() => refreshError);
              })
            );
          }
        }

        return throwError(() => error);
      })
    );
  }
}
