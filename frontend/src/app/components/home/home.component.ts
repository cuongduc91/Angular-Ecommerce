import { Component, OnInit } from '@angular/core';
import { ProductService } from 'src/app/services/product.service';
import { Router } from '@angular/router';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  products: any[] = [];
  constructor(
    private productService: ProductService,
    private router: Router,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.productService
      .getAllProducts()
      .subscribe((prods: { count: Number; products: any[] }) => {
        this.products = prods.products;
        // console.log(this.products);
      });
  }
  selectProduct(id: Number) {
    this.router.navigate(['/product', id]).then();
  }
  addToCart(id: number) {
    this.cartService.AddProductToCart(id);
  }
}
