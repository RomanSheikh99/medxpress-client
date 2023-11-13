import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/shared/models/product.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {

  showModal: boolean = false;
  categories = [{title: "allopathic"},{title: "herbal"}]


  categoryTitle: string = '';
  data: Product[] = [];
  allopathyData: Product[] = [];
  herbalData: Product[] = [];

  ngOnInit(): void {
    
  }

}
