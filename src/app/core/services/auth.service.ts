import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

interface LoginResponse {
  access_token: string;
  refresh_token: string;
  user_id: string;
  email: string;
}

interface User {
  id: string;
  email: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly AUTH_KEY = 'nimbus_auth';
  private readonly API_URL = environment.apiUrl || 'http://localhost:8081';
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  
  public currentUser$ = this.currentUserSubject.asObservable();
  public isAuthenticated$ = new BehaviorSubject<boolean>(false);

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.initializeAuthState();
  }

  private initializeAuthState(): void {
    const authData = this.getAuthData();
    if (authData) {
      this.currentUserSubject.next({ id: authData.user_id, email: authData.email });
      this.isAuthenticated$.next(true);
    }
  }

  private getAuthData(): { access_token: string; refresh_token: string; user_id: string; email: string } | null {
    const authData = localStorage.getItem(this.AUTH_KEY);
    return authData ? JSON.parse(authData) : null;
  }

  private setAuthData(data: LoginResponse): void {
    localStorage.setItem(this.AUTH_KEY, JSON.stringify(data));
    this.currentUserSubject.next({ id: data.user_id, email: data.email });
    this.isAuthenticated$.next(true);
  }

  private clearAuthData(): void {
    localStorage.removeItem(this.AUTH_KEY);
    this.currentUserSubject.next(null);
    this.isAuthenticated$.next(false);
  }

  getAccessToken(): string | null {
    const authData = this.getAuthData();
    return authData?.access_token || null;
  }

  getRefreshToken(): string | null {
    const authData = this.getAuthData();
    return authData?.refresh_token || null;
  }

  login(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.API_URL}/api/auth/login`, { email, password }).pipe(
      tap(response => this.setAuthData(response))
    );
  }

  register(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.API_URL}/api/auth/register`, { email, password }).pipe(
      tap(response => this.setAuthData(response))
    );
  }

  refreshToken(): Observable<{ access_token: string }> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }
    return this.http.post<{ access_token: string }>(`${this.API_URL}/api/auth/refresh`, {
      refresh_token: refreshToken
    }).pipe(
      tap(({ access_token }) => {
        const authData = this.getAuthData();
        if (authData) {
          this.setAuthData({ ...authData, access_token });
        }
      })
    );
  }

  logout(): void {
    const refreshToken = this.getRefreshToken();
    if (refreshToken) {
      this.http.post(`${this.API_URL}/api/auth/logout`, { refresh_token: refreshToken }).subscribe();
    }
    this.clearAuthData();
    this.router.navigate(['/login']);
  }

  getAuthHeaders(): { [header: string]: string } {
    const token = this.getAccessToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  }
}
