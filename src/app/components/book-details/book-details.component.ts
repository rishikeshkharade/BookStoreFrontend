import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BookService } from 'src/app/services/book/book.service';
import { LoaderService } from 'src/app/services/loader/loader.service';
import { CartService } from 'src/app/services/cart/cart.service';
import { ChangeDetectorRef } from '@angular/core';
import { WishlistService } from 'src/app/services/wishlist/wishlist.service';

@Component({
  selector: 'app-book-details',
  templateUrl: './book-details.component.html',
  styleUrls: ['./book-details.component.scss']
})
export class BookDetailsComponent implements OnInit {
  book: any;
  quantity = 0;
  placeholder = 'No description available.';
  isWishlisted = false;
  wishlistId: number | null = null;


  constructor(
    private route: ActivatedRoute,
    private bookService: BookService,
    private loader: LoaderService,
    private cartService: CartService,
    private cdr: ChangeDetectorRef,
    private wishlistService: WishlistService
  ) {}

  ngOnInit(): void {
    const bookId = this.route.snapshot.paramMap.get('id');
    if (bookId) {
      this.loader.show();
      this.bookService.getBookById(+bookId).subscribe({
        next: (res: any) => {
          this.book = res.data;
          this.loader.hide();
          this.loadQuantityFromCart();
          this.loadWishlistStatus();
        },
        error: () => this.loader.hide()
      });
    }
  }

loadQuantityFromCart(): void {
  this.cartService.getCartItems().subscribe({
    next: (items: any[]) => {
      const cartItem = items.find((item: any) =>
        (item.bookId || item.book?.bookId) === this.book.bookId
      );
      this.quantity = cartItem ? cartItem.quantity : 0;

      this.cdr.detectChanges(); // Ensure UI updates
    },
    error: err => console.error('Cart load failed', err)
  });
}

loadWishlistStatus(): void {
  this.wishlistService.getWishlists().subscribe({
    next: (items: any[]) => {
      const found = items.find(item =>
        item.bookId === this.book.bookId || item.book?.bookId === this.book.bookId
      );
      this.isWishlisted = !!found;
      this.wishlistId = found?.wishlistId;
      this.cdr.detectChanges();
    }
  });
}




addToBag(): void {
  this.quantity = 1; // ✅ immediately show qty box
  const payload = { bookId: this.book.bookId, quantity: 1 };
  this.cartService.addToCart(payload).subscribe({
    next: () => {
      this.loadQuantityFromCart(); // still syncs actual state
      this.cartService.refreshCartCount();
    },
    error: () => console.error('Failed to add to cart')
  });
}



  increment(): void {
    this.quantity++;
    this.cartService.updateCartItemQuantity(this.book.bookId, this.quantity).subscribe({
      next: () => {
        this.loadQuantityFromCart();
        this.cartService.refreshCartCount();
      }
    });
  }

  decrement(): void {
    if (this.quantity > 1) {
      this.quantity--;
      this.cartService.updateCartItemQuantity(this.book.bookId, this.quantity).subscribe({
        next: () => {
          this.loadQuantityFromCart();
          this.cartService.refreshCartCount();
        }
      });
    } else if (this.quantity === 1) {
      // Remove from cart
      this.cartService.removeCartItemByBookId(this.book.bookId).subscribe({
        next: () => {
          this.quantity = 0;
          this.cartService.refreshCartCount();
        }
      });
    }
  }

  getImageUrl(image: string): string {
    if (!image) {
      return 'assets/images/dummy-book.jpg';
    }
    return image.startsWith('http')
      ? image
      : `https://m.media-amazon.com/images/I/${image}`;
  }

toggleWishlist(): void {
  if (this.isWishlisted) {
    // Remove from wishlist
    this.wishlistService.removeFromWishlistByBookId(this.book.bookId).subscribe({
      next: () => {
        this.isWishlisted = false;
        console.log('Removed from wishlist');
      },
      error: err => {
        console.error('Failed to remove from wishlist', err);
      }
    });
  } else {
    // Add to wishlist
    this.wishlistService.addToWishlist(this.book.bookId).subscribe({
      next: () => {
        this.isWishlisted = true;
        console.log('Added to wishlist');
      },
      error: err => {
        // Handle 400 already exists gracefully
        if (err?.error?.message === 'Book is already in wishlist') {
          this.isWishlisted = true;
          console.warn('Already in wishlist, setting to active');
        } else {
          console.error('Failed to add to wishlist', err);
        }
      }
    });
  }
}
}
