import { Component, Input, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Product } from 'src/app/shared/models/product.model';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-products-by-category',
  templateUrl: './products-by-category.component.html',
  styleUrls: ['./products-by-category.component.scss'],
})
export class ProductsByCategoryComponent implements OnInit {
  medicines: Product[] = [];
  isLoading: boolean = false;
  @Input() category!: {title: string};

  constructor(private productService: ProductService) {}

  /**
   * Lifecycle hook that is called after Angular has initialized all data-bound properties of a directive.
   * Initialize the component by fetching the products by type and subscribing to the response.
   */
  ngOnInit(): void {
    this.isLoading = true;

   this.productService.fetchProductsByType(this.category.title).subscribe({
      next: (medicines) => {
        this.medicines = medicines;
      },
      error: (err) => {
        console.error(err);
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }
}
