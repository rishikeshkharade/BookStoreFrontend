import { Component, OnInit } from '@angular/core';
import { WishlistService } from 'src/app/services/wishlist/wishlist.service';
import { BookService } from 'src/app/services/book/book.service';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.scss']
})
export class WishlistComponent implements OnInit {
  wishlistItems: any[] = [];

  constructor(
    private wishlistService: WishlistService,
    private bookService: BookService
  ) {}

  ngOnInit(): void {
    this.loadWishlist();
  }

  loadWishlist(): void {
    this.wishlistService.getWishlists().subscribe({
      next: async (data: any[]) => {
        const books = await Promise.all(
          data.map(item =>
            this.bookService.getBookById(item.bookId).toPromise().then((res: any) => ({
              ...res.data,
              wishlistId: item.wishlistId
            })).catch(() => null)
          )
        );
        this.wishlistItems = books.filter(Boolean);
      },
      error: err => {
        console.error('Failed to load wishlist:', err);
      }
    });
  }

  remove(item: any): void {
    this.wishlistService.removeFromWishlist(item.wishlistId).subscribe({
      next: () => this.loadWishlist()
    });
  }

  getImageUrl(image?: string): string {
    if (!image) return 'assets/images/dummy-book.jpg';
    return image.startsWith('http')
      ? image
      : `https://m.media-amazon.com/images/I/${image}`;
  }
}
