import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-order-success',
  templateUrl: './order-success.component.html',
  styleUrls: ['./order-success.component.scss']
})
export class OrderSuccessComponent {
  orderId: string = '#123456'; // fallback

  constructor(private router: Router) {
    const nav = this.router.getCurrentNavigation();
    const stateOrderId = nav?.extras?.state?.['orderId'];
    if (stateOrderId) this.orderId = '#' + stateOrderId;
  }

  goToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }
}
