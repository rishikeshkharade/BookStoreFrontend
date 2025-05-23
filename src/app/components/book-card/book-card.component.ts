import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-book-card',
  templateUrl: './book-card.component.html',
  styleUrls: ['./book-card.component.scss']
})
export class BookCardComponent {
@Input() book: any;
@Output() viewDetails = new EventEmitter<number>();

 constructor(private router: Router) {}

  goToDetails(): void {
    this.router.navigate(['/book', this.book.bookId]);
  }

getImageUrl(image: string): string {
  if (!image) {
    return 'assets/images/dummy-book.jpg';
  }

  // Check if it's a full URL or just a filename
  return image.startsWith('http') 
    ? image 
    : `https://m.media-amazon.com/images/I/${image}`;
}

onImageError(event: Event) {
  console.warn('Fallback image triggered');
  const img = event.target as HTMLImageElement;
img.src = 'assets/images/dummy-book.jpg?v=1';
}

formatPrice(price: number): string {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(price);
}

}

