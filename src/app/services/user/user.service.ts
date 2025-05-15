import { Injectable } from '@angular/core';
import { HttpService } from '../http/http.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private base = "users";

  constructor(private http: HttpService) { }

  signup(data: { fullName: string; email: string; password: string }): Observable<any> {
    return this.http.post(`${this.base}`, data);
  }

  /** Authenticate and receive tokens */
  login(data: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.base}/login`, data);
  }

  /** Refresh access token using refresh token */
  refreshToken(refreshToken: string): Observable<any> {
    return this.http.post(`${this.base}/refresh-token`, { refreshToken });
  }
}
