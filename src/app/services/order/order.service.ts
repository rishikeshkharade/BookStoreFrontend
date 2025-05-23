import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { HttpService } from '../http/http.service';
@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(private http: HttpService) { }

  getOrders(): Observable<any[]> {
  return this.http.get<any>('orders').pipe(
    map(res => res.data || []) // Adjust based on actual API structure
  );
}
}
