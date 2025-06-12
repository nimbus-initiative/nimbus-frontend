import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
  HttpStatusCode,
} from '@angular/common/http';
import { Observable, catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private isRefreshing = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    // Skip adding auth token for auth and refresh endpoints
    if (request.url.includes('/api/auth/')) {
      return next.handle(request);
    }

    // Add auth token to the request
    const authReq = this.addAuthHeader(request);

    return next.handle(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        // Handle 401 Unauthorized errors
        if (error.status === HttpStatusCode.Unauthorized) {
          // If we're already trying to refresh, don't try again
          if (this.isRefreshing) {
            this.authService.logout();
            return throwError(() => error);
          }

          // Try to refresh the token
          return this.handle401Error(authReq, next);
        }

        return throwError(() => error);
      })
    );
  }

  private addAuthHeader(request: HttpRequest<unknown>): HttpRequest<unknown> {
    const authToken = this.authService.getAccessToken();
    if (!authToken) {
      return request;
    }

    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${authToken}`,
      },
    });
  }

  private handle401Error(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    this.isRefreshing = true;

    return this.authService.refreshToken().pipe(
      switchMap(() => {
        this.isRefreshing = false;
        // Retry the original request with the new token
        return next.handle(this.addAuthHeader(request));
      }),
      catchError((error) => {
        this.isRefreshing = false;
        this.authService.logout();
        return throwError(() => error);
      })
    );
  }
}
