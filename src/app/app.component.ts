import { Component } from '@angular/core';
import { LoaderService } from './services/loader/loader.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'BookStore';
  isLoading = false;

  constructor(private loader: LoaderService) {
    this.loader.loading$.subscribe((status: boolean) => this.isLoading = status);
  }
}
