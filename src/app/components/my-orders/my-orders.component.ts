import { Component } from '@angular/core';
import { OrderService } from 'src/app/services/order/order.service';
import { BookService } from 'src/app/services/book/book.service';

@Component({
  selector: 'app-my-orders',
  templateUrl: './my-orders.component.html',
  styleUrls: ['./my-orders.component.scss']
})
export class MyOrdersComponent {
  orders: any[] = [];

constructor(private orderService: OrderService, private bookService: BookService) {}


ngOnInit(): void {
  this.loadOrders();
}

loadOrders(): void {
  this.orderService.getOrders().subscribe({
    next: res => {
      const allOrders = res; // This is an array of orders

      allOrders.forEach(order => {
        order.items.forEach((item: { bookId: number; }) => {
          this.bookService.getBookById(item.bookId).subscribe({
            next: bookRes => {
              this.orders.push({
                ...item,
                book: bookRes.data,
                purchaseAt: order.purchaseAt
              });
            },
            error: err => console.error('Book fetch failed', err)
          });
        });
      });
    },
    error: err => console.error('Order fetch failed', err)
  });
}


getImageUrl(image: string): string {
  return image?.startsWith('http')
    ? image
    : `https://m.media-amazon.com/images/I/${image}`;
}


formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return isNaN(date.getTime())
    ? 'Unknown Date'
    : date.toLocaleDateString('en-IN', { month: 'short', day: '2-digit' });
}

}
