import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from 'src/app/services/cart/cart.service';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  @Output() search = new EventEmitter<string>();
  searchValue: string = '';
  userName: string = 'User';
  cartCount = 0;

  constructor(private router: Router, private cartService: CartService) {}

  ngOnInit(): void {
  // Get logged-in user name from localStorage
  const userData = localStorage.getItem('user');
  if (userData) {
    try {
      const user = JSON.parse(userData);
      this.userName = user?.fullName?.split(' ')[0] || 'User';

    } catch (err) {
      console.error('Error parsing user data from localStorage:', err);
      this.userName = 'User';
    }
  } else {
    this.userName = 'User';
  }

  // Subscribe to cart count changes
  this.cartService.cartCount$.subscribe((count: number) => {
    this.cartCount = count;
  });

  // Fallback: Set cart count from local items if available
  const currentItems = this.cartService.getCartItems();
  if (Array.isArray(currentItems)) {
    this.cartCount = currentItems.reduce((total, item) => total + item.quantity, 0);
  }
}


  onSearchChange(event: Event): void {
    this.searchValue = (event.target as HTMLInputElement).value;
    this.search.emit(this.searchValue);
  }

  triggerSearch(): void {
    if (this.searchValue.trim()) {
      this.search.emit(this.searchValue);
    }
  }

  goToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }

  logout(): void {
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  goToCart(): void {
    this.router.navigate(['/cart']);
  }

  goToOrders(): void {
  this.router.navigate(['/orders']);
}

goToWishlist() {
  this.router.navigate(['/wishlist']);
}
}
