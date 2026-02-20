import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { rxResource } from '@angular/core/rxjs-interop';
import { AuthResponse } from '@auth/interfaces/auth-response.interface';
import { User } from '@auth/interfaces/user.interface';
import { map, tap, Observable, catchError, of } from 'rxjs';
import { environment } from 'src/environments/environment';

type AuthStatus = 'checking' | 'authenticated' | 'not-authenticated'
const baseUrl = environment.baseUrl;

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _authStatus =  signal<AuthStatus>('checking');
  private _user = signal<User|null>(null);
  private _token = signal<string|null>(localStorage.getItem('token'));
  checkStatusResource = rxResource({
    loader: () => {
      console.log('checkstatus()');
      return this.checkStatus()}
  })

  private http = inject(HttpClient);
  private router = inject(Router);

  authStatus = computed(() => {
    if( this._authStatus() == 'checking') return 'checking';
    if(this._user()) return 'authenticated'
    return 'not-authenticated'
  })

  user = computed(() => this._user());
  token = computed(() =>this._token());

  login(email:string, password:string):Observable<boolean>{
    return this.http.post<AuthResponse>(`${baseUrl}/auth/login`,{
      email: email,
      password: password
    }).pipe(
      map((resp) => this.handleAuthSuccess(resp)),
      catchError((error)=>this.handleAuthError(error))
    )
  }

  register(email:string, fullName:string, password:string):Observable<boolean>{
    return this.http.post<AuthResponse>(`${baseUrl}/auth/register`,{
      email: email,
      fullName: fullName,
      password: password
    }).pipe(
      map((resp) => this.handleAuthSuccess(resp)),
      catchError((error)=>this.handleAuthError(error))
    )
  }

  checkStatus():Observable<boolean>{
    const token = localStorage.getItem('token');
    if(!token) {
      this._user.set(null);
      this._token.set(null);
      this._authStatus.set('not-authenticated');
      return of(false);
    }
    return this.http.get<AuthResponse>(`${baseUrl}/auth/check-status`).pipe(
      map((resp) => this.handleAuthSuccess(resp)),
      catchError((error)=>this.handleAuthError(error))
    )
  }

  logout() {
    this._user.set(null);
    this._token.set(null);
    this._authStatus.set('not-authenticated');
    localStorage.removeItem('token');
    this.router.navigateByUrl('/auth/login');
  }

  private handleAuthSuccess(resp:AuthResponse){
    this._authStatus.set('authenticated');
    this._user.set(resp.user);
    this._token.set(resp.token);

    localStorage.setItem('token', resp.token);
    localStorage.setItem('authStatus', 'authenticated');
    return true
  }

  private handleAuthError(error:any){
    this._user.set(null);
    this._token.set(null);
    this._authStatus.set('not-authenticated');
    localStorage.removeItem('token');
    return of(false)
  }

}
