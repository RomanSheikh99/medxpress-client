import { Injectable } from '@angular/core';
import { TokenService } from 'src/app/shared/services/token.service';
import { Observable, catchError, throwError } from 'rxjs';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Product } from 'src/app/shared/models/product.model';
import { getBaseUrl } from 'src/app/shared/utilityFunctions';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  // ! CHANGE HERE
  baseUrl = getBaseUrl();
  randomPage = Math.floor(Math.random() * 30) + 1;

  constructor(private http: HttpClient, private tokenService: TokenService) {}

  /**
   * Fetches products by type.
   * @param type - The type of product to fetch.
   * @returns An observable of the fetched products.
   */
  fetchProductsByType(type: string): Observable<Product[]> {
    console.log(type)
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.tokenService.getAccessToken()}`,
    });
    return this.http
      .get<Product[]>(
        `${this.baseUrl}/medicines/find?page=1&limit=10&type=${type}`,
        { headers }
      )
      .pipe(catchError(this.handleError));
  }

  /**
   * Searches for products by name.
   * @param name - The name of the product to search for.
   * @returns An Observable that emits an array of Product objects.
   */
  searchProduct(name: string): Observable<Product[]> {
    const headers = this.getHeaders();
    return this.http
      .get<Product[]>(
        `${this.baseUrl}/medicines/find?page=1&limit=5&search=${name}`,
        { headers }
      )
      .pipe(catchError(this.handleError));
  }

  /**
   * Fetches products by dosage form.
   * @param dosage_form - The dosage form to filter products by.
   * @returns An Observable of Product[].
   */
  fetchProductsByForm(dosage_form: string): Observable<Product[]> {
    return this.http
      .get<Product[]>(
        `${this.baseUrl}/medicines/find?page=1&limit=10&dosage_form=${dosage_form}`
      )
      .pipe(catchError(this.handleError));
  }

  /**
   * Fetches a product by its ID.
   * @param id The ID of the product to fetch.
   * @returns An Observable that emits the fetched Product.
   */
  fetchProductById(id: any): Observable<Product> {
    const headers = this.getHeaders();

    return this.http
      .get<Product>(`${this.baseUrl}/medicines/${id}`, { headers })
      .pipe(catchError(this.handleError));
  }

  /**
   * Returns the HTTP headers with the authorization token.
   * @returns The HTTP headers with the authorization token.
   */
  getHeaders() {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.tokenService.getAccessToken()}`,
    });
    return headers;
  }

  /**
   * Returns an observable of an array of Product objects.
   * The products are fetched from the server randomly.
   * @param page The page number to fetch.
   * @returns An observable of an array of Product objects.
   */
  getRandomProducts(page: number): Observable<Product[]> {
    const headers = this.getHeaders();
    return this.http
      .get<Product[]>(`${this.baseUrl}/medicines/find?page=${page}&limit=5`, {
        headers,
      })
      .pipe(catchError(this.handleError));
  }

  /**
   * Handles HTTP errors.
   * @param error - The HttpErrorResponse object.
   * @returns An Observable that emits an Error object.
   */
  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      console.error('An error occurred:', error.error);
    } else {
      console.error(
        `Backend returned code ${error.status}, body was: `,
        error.error
      );
    }
    return throwError(
      () => new Error('Something bad happened; please try again later.')
    );
  }
}
