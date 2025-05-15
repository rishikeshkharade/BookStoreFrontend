import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  private baseUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) { }

  get<T>(path: string, params?: any): Observable<T> {
    const httpParams = new HttpParams({ fromObject: params });
    return this.http.get<T>(`${this.baseUrl}/${path}`, { params: httpParams });
  }

  post<T>(path: string, body: any): Observable<T> {
    return this.http.post<T>(`${this.baseUrl}/${path}`, body);
  }

  put<T>(path: string, body: any): Observable<T> {
    return this.http.put<T>(`${this.baseUrl}/${path}`, body);
  }

  delete<T>(path: string, params?: any): Observable<T> {
    const httpParams = new HttpParams({ fromObject: params });
    return this.http.delete<T>(`${this.baseUrl}/${path}`, { params: httpParams });
  }
}