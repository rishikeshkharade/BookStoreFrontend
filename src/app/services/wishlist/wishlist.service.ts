import { Injectable } from '@angular/core';
import { HttpService } from '../http/http.service';
import { map, Observable, switchMap, throwError } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class WishlistService {
  constructor(private http: HttpService) {}

  getWishlists(): Observable<any[]> {
    return this.http.get<any>('wishlists').pipe(map(res => res.data));
  }

  addToWishlist(bookId: number): Observable<any> {
    return this.http.post<any>('wishlists', { bookId });
  }

  removeFromWishlist(wishlistId: number): Observable<any> {
    return this.http.delete<any>(`wishlists/${wishlistId}`);
  }

 

removeFromWishlistByBookId(bookId: number): Observable<any> {
  return this.getWishlists().pipe(
    switchMap((data: any[]) => {
      const match = data.find((item: any) => item.bookId === bookId);
      if (match?.wishlistId) {
        return this.removeFromWishlist(match.wishlistId);
      } else {
        return throwError(() => new Error('Wishlist item not found'));
      }
    })
  );
}

}
