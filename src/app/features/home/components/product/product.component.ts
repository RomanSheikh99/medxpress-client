import { Component, Input, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from 'src/app/features/cart/services/cart.service';
import { Product } from 'src/app/shared/models/product.model';
import { HotToastService } from '@ngneat/hot-toast';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
})
export class ProductComponent {
  @Input() product: Product | undefined;

  constructor(private router: Router, private cartService: CartService) {}

  showModal = false;
  imgSrc: string = '';
  private toastService = inject(HotToastService);

  /**
   * Sets the image source based on the dosage form of the product.
   */
  setImage() {
    if (this.product) {
      switch (this.product.dosage_form) {
        case 'Syrup':
          this.imgSrc = 'assets/icons/syrup.svg';
          break;
        case 'Ophthalmic Suspension' || 'Powder for Suspension':
          this.imgSrc = 'assets/icons/suspension.svg';
          break;
        case 'Capsule' || 'Tablet':
          this.imgSrc = 'assets/icons/capsule.svg';
          break;
        case 'IV Infusion' || 'IM/IV Injection':
          this.imgSrc = 'assets/icons/injection.svg';
          break;
        case 'Cream':
          this.imgSrc = 'assets/icons/ointment.svg';
          break;
        default:
          this.imgSrc = 'assets/icons/capsule.svg';
          break;
      }
    }
  }

  /**
   * Navigates to the product details page for the current product.
   */
  productDetailsView() {
    this.router.navigate(['/products', this.product?._id]);
  }

  /**
   * Lifecycle hook that is called after Angular has initialized all data-bound properties of a directive.
   * Define an ngOnInit() method to handle any additional initialization tasks.
   */
  ngOnInit(): void {
    this.setImage();
  }

  /**
   * Adds the current product to the cart with a quantity of 1 and displays a success toast message.
   */
  handleAddToCart() {
    this.cartService.addToCart(this.product!, 1, 0, 1);

    this.toastService.success('Added to cart', {
      icon: '✔',
      position: 'top-center',
      duration: 2000,
      style: {
        border: '1px solid #067A46',
        padding: '16px',
        color: '#067A46',
        background: '#D2F895',
        fontFamily: 'Agrandir-Regular',
      },
    });
  }
}
