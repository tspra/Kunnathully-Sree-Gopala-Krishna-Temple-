import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private readonly authService: AuthService) {}

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const token = this.authService.getToken();
    
    if (req.url.includes('/api/content/about')) {
      console.log('Auth Interceptor: Processing request to /api/content/about');
      console.log('Auth Interceptor: Token available:', !!token);
      console.log('Auth Interceptor: Method:', req.method);
    }
    
    if (!token) {
      return next.handle(req);
    }

    const securedRequest = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });

    if (req.url.includes('/api/content/about')) {
      console.log('Auth Interceptor: Added Bearer token to request');
    }

    return next.handle(securedRequest);
  }
}