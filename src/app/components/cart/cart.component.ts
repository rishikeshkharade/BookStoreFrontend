import { Component, OnInit } from '@angular/core';
import { BookService } from 'src/app/services/book/book.service';
import { CartService } from 'src/app/services/cart/cart.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Route, Router } from '@angular/router';



@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {

  getTotalAmount() {
throw new Error('Method not implemented.');
}
  cartItems: any[] = [];
  showAddress = false;
  showSummary = false;
  showCart = true;
  customerForm!: FormGroup;

  constructor(private cartService: CartService, private bookService: BookService, private fb: FormBuilder, private router: Router) {}

  ngOnInit(): void {
    this.initCustomerForm();
    this.loadCart();
  }

  initCustomerForm(): void {
  this.customerForm = this.fb.group({
    fullName: ['', Validators.required],
    mobile: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
    type: ['', Validators.required],
    address: ['', Validators.required],
    city: ['', Validators.required],
    state: ['', Validators.required]
  });
}

loadCart(): void {
  this.cartService.getCartItems().subscribe({
    next: (items: any[]) => {
      this.cartItems = [];

      items.forEach(item => {
        const bookId = item.bookId || item.book?.bookId;
        if (bookId) {
          this.bookService.getBookById(bookId).subscribe({
            next: book => {
              item.book = book.data || book;
              this.cartItems.push(item);
            },
            error: err => {
              console.warn('Failed to load book for cart item', err);
              this.cartItems.push(item); // fallback
            }
          });
        } else {
          this.cartItems.push(item); // fallback
        }
      });
    },
    error: err => console.error('Failed to load cart', err)
  });
}



  increaseQty(item: any): void {
    const newQty = item.quantity + 1;
    this.cartService.updateCartItemQuantity(item.cartId, newQty).subscribe({
      next: () => this.loadCart()
    });
  }

  decreaseQty(item: any): void {
    if (item.quantity > 1) {
      const newQty = item.quantity - 1;
      this.cartService.updateCartItemQuantity(item.cartId, newQty).subscribe({
        next: () => this.loadCart()
      });
    }
  }

  removeItem(item: any): void {
    this.cartService.deleteCartItem(item.cartId).subscribe({
      next: () => this.loadCart()
    });
  }

  placeOrder(): void {
    this.showAddress = true;
  }

  continueToSummary(): void {
    this.showSummary = true;
  }

getImageUrl(image: string): string {
  if (!image) return 'assets/images/dummy-book.jpg';
  return image.startsWith('http')
    ? image
    : `https://m.media-amazon.com/images/I/${image}`;
}



finalPlaceOrder(): void {
  this.cartService.purchaseOrder().subscribe({
    next: res => {
      const orderId = res?.data?.orderId || '123456';

      // ✅ Only refresh count (cart is already cleared in backend)
      this.cartService.refreshCartCount();

      // ✅ Navigate to success page
      this.router.navigate(['/order-success'], { state: { orderId } });
    },
    error: err => {
      console.error('Order failed', err);
      alert('Something went wrong while placing the order.');
    }
  });
}



  toggleSection(section: string): void {
  this.showCart = section === 'cart' ? !this.showCart : false;
  this.showAddress = section === 'address' ? !this.showAddress : false;
  this.showSummary = section === 'summary' ? !this.showSummary : false;
}

onContinueToSummary(): void {
  if (this.customerForm.invalid) {
    this.customerForm.markAllAsTouched();
    return;
  }

  this.toggleSection('summary');
}
}
