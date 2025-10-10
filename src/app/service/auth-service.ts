import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

export interface User {
  id: string;
  username: string;
  email: string;
  profileImage?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // private apiUrl = 'http://localhost:3000/api/auth';

  private apiUrl = 'http://localhost:3000/api/auth';
  private tokenKey = 'authToken';
  private userKey = 'currentUser';
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadUserFromStorage();
  }

  register(data: RegisterData): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, data);
  }

  login(data: LoginData): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, data).pipe(
      tap((response) => {
        this.setToken(response.token);
        // Don't store user with potentially large profileImage in localStorage
        // Just store essential data
        const userForStorage = {
          id: response.user.id,
          username: response.user.username,
          email: response.user.email,
          // Don't store profileImage in localStorage to avoid quota issues
        };
        this.setUser(userForStorage);
        this.currentUserSubject.next(response.user);
      })
    );
  }

  logout(): void {
    this.removeToken();
    this.removeUser();
    this.currentUserSubject.next(null);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  private setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  private removeToken(): void {
    localStorage.removeItem(this.tokenKey);
  }

  private setUser(user: User): void {
    localStorage.setItem(this.userKey, JSON.stringify(user));
  }

  private removeUser(): void {
    localStorage.removeItem(this.userKey);
  }

  private loadUserFromStorage(): void {
    const userStr = localStorage.getItem(this.userKey);
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        this.currentUserSubject.next(user);
      } catch (e) {
        console.error('Error parsing user from localStorage', e);
        this.removeUser();
      }
    }
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  getMe(): Observable<User> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.getToken()}`,
    });
    return this.http.get<User>(`${this.apiUrl}/me`, { headers });
  }

  updateProfile(data: any): Observable<User> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.getToken()}`,
    });
    return this.http
      .put<User>(`${this.apiUrl}/profile`, data, { headers })
      .pipe(
        tap((updatedUser) => {
          // Don't store user with potentially large profileImage in localStorage
          // Just update the BehaviorSubject
          this.currentUserSubject.next(updatedUser);
        })
      );
  }

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/users`);
  }

  getUserOrders(): Observable<any[]> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.getToken()}`,
    });
    return this.http.get<any[]>(`${this.apiUrl.replace('/auth', '/orders')}`, {
      headers,
    });
  }

  getOrderById(orderId: string): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.getToken()}`,
    });
    return this.http.get<any>(
      `${this.apiUrl.replace('/auth', '/orders')}/${orderId}`,
      { headers }
    );
  }
}
