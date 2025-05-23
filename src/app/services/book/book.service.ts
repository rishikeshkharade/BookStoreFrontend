import { Injectable } from '@angular/core';
import { HttpService } from '../http/http.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BookService {
 
  getBookById(bookId: number): Observable<any> {
    return this.http.get(`books/${bookId}`);
  }

  constructor(private http: HttpService) { }

  getAllBooks(): Observable<any> {
    return this.http.get('books');
  }

  searchBooks(keyword: string): Observable<any> {
 return this.http.get(`books/search?keyword=${keyword}`);

}

sortBooks(sortBy: string, order: string) {
  return this.http.get(`books/sort?sortBy=${sortBy}&order=${order}`);
}

getRecentBooks() {
  return this.http.get(`books/recent`);
}
}
