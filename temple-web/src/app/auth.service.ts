import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { LoginResponse } from './temple-content.model';

const tokenKey = 'temple_auth_token';
const tokenExpiryKey = 'temple_auth_expiry';
const roleKey = 'temple_auth_role';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private readonly router: Router) {}

  setSession(response: LoginResponse): void {
    localStorage.setItem(tokenKey, response.token);
    localStorage.setItem(tokenExpiryKey, response.expiresAtUtc);
    localStorage.setItem(roleKey, response.role);
  }

  getToken(): string | null {
    if (!this.isLoggedIn()) {
      return null;
    }

    return localStorage.getItem(tokenKey);
  }

  isLoggedIn(): boolean {
    const token = localStorage.getItem(tokenKey);
    const expiry = localStorage.getItem(tokenExpiryKey);
    if (!token || !expiry) {
      return false;
    }

    const expiryDate = new Date(expiry);
    return !Number.isNaN(expiryDate.getTime()) && expiryDate.getTime() > Date.now();
  }

  isAdmin(): boolean {
    return this.isLoggedIn() && localStorage.getItem(roleKey) === 'Admin';
  }

  logout(): void {
    localStorage.removeItem(tokenKey);
    localStorage.removeItem(tokenExpiryKey);
    localStorage.removeItem(roleKey);
    void this.router.navigate(['/login']);
  }
}