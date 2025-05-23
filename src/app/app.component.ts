import { Component, ChangeDetectionStrategy, ChangeDetectorRef, OnInit } from '@angular/core';
import { LoaderService } from './services/loader/loader.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush // 👈 ADD THIS LINE
})
export class AppComponent implements OnInit {
  loading$!: Observable<boolean>;

  constructor(private loaderService: LoaderService, private cd: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.loading$ = this.loaderService.loading$;

    // 👇 Trigger change detection manually
    this.loaderService.loading$.subscribe(() => {
      this.cd.detectChanges();
    });
  }
}
