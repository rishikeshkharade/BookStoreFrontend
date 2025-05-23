import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { HttpService } from '../http/http.service';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartCount = new BehaviorSubject<number>(0);
  cartCount$ = this.cartCount.asObservable();

  constructor(private http: HttpService) {}

  /** Get all cart items from API */
  getCartItems(): Observable<any[]> {
    return this.http.get<any>('cart').pipe(
      map(res => res.data?.items || res.data || []), // array from API response
      tap(items => this.cartCount.next(this.getCountFromItems(items)))
    );
  }

  /** Add a book to cart via API */
  addToCart(payload: { bookId: number, quantity: number }): Observable<any> {
    return this.http.post<any>('cart', payload).pipe(
      tap(() => this.refreshCartCount())
    );
  }

/** Update cart item quantity via cartId */
updateCartItemQuantity(bookId: number, quantity: number): Observable<any> {
  return new Observable(observer => {
    this.getCartItems().subscribe(items => {
      const item = items.find((i: any) =>
        (i.bookId || i.book?.bookId) === bookId
      );
      if (item && item.cartId) {
        this.http.put<any>(`cart/${item.cartId}`, { quantity }).subscribe({
          next: res => {
            this.refreshCartCount();
            observer.next(res);
            observer.complete();
          },
          error: err => observer.error(err)
        });
      } else {
        observer.error('Cart item not found');
      }
    });
  });
}



  /** Delete a cart item by cartId (API) */
  deleteCartItem(cartId: number): Observable<any> {
    return this.http.delete<any>(`cart/${cartId}`).pipe(
      tap(() => this.refreshCartCount())
    );
  }

  /** Remove cart item by BookId (helper for book-details component) */
  removeCartItemByBookId(bookId: number): Observable<any> {
    return new Observable(observer => {
      this.getCartItems().subscribe(items => {
        const item = items.find((i: any) =>
          (i.bookId || i.book?.bookId) === bookId
        );
        if (item && item.cartId) {
          this.deleteCartItem(item.cartId).subscribe({
            next: res => {
              this.refreshCartCount();
              observer.next(res);
              observer.complete();
            },
            error: err => observer.error(err)
          });
        } else {
          observer.error('Cart item not found');
        }
      });
    });
  }

  /** Utility: Update the cart count by fetching cart items */
  refreshCartCount(): void {
    this.getCartItems().subscribe();
  }

  /** Utility: Get total cart count from items */
 private getCountFromItems(items: any[]): number {
  return items?.length || 0; // just number of items
}

purchaseOrder(): Observable<any> {
  return this.http.post<any>('orders/purchase', {});
}
}
