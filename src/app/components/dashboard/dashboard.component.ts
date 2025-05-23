import { Component, OnInit, ViewChild } from '@angular/core';
import { BookService } from 'src/app/services/book/book.service';
import { FormControl } from '@angular/forms';
import { LoaderService } from 'src/app/services/loader/loader.service';
import { MatSelect } from '@angular/material/select';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  books: any[] = [];
  allBooks: any[] = [];
  searchControl = new FormControl('');
  @ViewChild(MatSelect) matSelect!: MatSelect;

  pageSize = 8;
  currentPage = 1;

  constructor(private bookService: BookService, private loader: LoaderService, private router: Router) {}

  ngOnInit(): void {
    this.loadAllBooks();
  }

  navigateToBook(bookId: number): void {
  this.router.navigate(['/book', bookId]);
}

  loadAllBooks(): void {
    this.loader.show();
    this.bookService.getAllBooks().subscribe({
      next: (res) => {
        this.allBooks = res.data;
        this.setPage(1);
        this.loader.hide();
      },
      error: (err: any) => {
        console.error('Failed to load books:', err);
        this.loader.hide();
      }
    });
  }

  setPage(pageNumber: number): void {
    this.currentPage = pageNumber;
    const start = (pageNumber - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.books = this.allBooks.slice(start, end);
  }

  onSearchInput(searchTerm: string): void {
    const term = searchTerm.trim().toLowerCase();

    if (!term) {
      this.setPage(1);
      return;
    }

    const filtered = this.allBooks.filter(book =>
      book.bookName.toLowerCase().includes(term) ||
      book.author.toLowerCase().includes(term)
    );

    this.books = filtered.slice(0, this.pageSize); // only show 1st page of search results
  }

  onSortChange(value: string): void {
    this.loader.show();
    if (value === 'recent') {
      this.bookService.getRecentBooks().subscribe({
        next: (res: any) => {
          this.allBooks = res.data;
          this.setPage(1);
          this.loader.hide();
        },
        error: (err) => {
          console.error('Error fetching recent books:', err);
          this.loader.hide();
        }
      });
    } else {
      const sortOrder = value === 'lowToHigh' ? 'asc' : 'desc';
      this.bookService.sortBooks('price', sortOrder).subscribe({
        next: (res: any) => {
          this.allBooks = res.data;
          this.setPage(1);
          this.loader.hide();
        },
        error: (err) => {
          console.error('Error sorting books:', err);
          this.loader.hide();
        }
      });
    }
  }

  onPageChange(page: number): void {
    this.setPage(page);
  }

  ngAfterViewInit() {
  if (this.matSelect) {
    this.matSelect.focus = () => {}; // Prevents blinking cursor
  }
}
}
