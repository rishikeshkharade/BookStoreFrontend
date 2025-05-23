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
goToOrders: any;

  constructor(private router: Router, private cartService: CartService) {}

  ngOnInit(): void {
    const userData = localStorage.getItem('user');
    if (userData) {
      // "fullName" property from login API
      this.userName = JSON.parse(userData)?.fullName || 'User';
    }

    this.cartService.cartCount$.subscribe((count: number) => {
      this.cartCount = count;
    });

    // Set initial count from local items if needed (good fallback)
    // Use observable if possible, but fallback for initial UI render
    const currentItems: any = (this.cartService as any).cartItems || [];
    if (Array.isArray(currentItems)) {
      this.cartCount = currentItems.reduce((total, item) => total + (item.quantity || 0), 0);
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
}
