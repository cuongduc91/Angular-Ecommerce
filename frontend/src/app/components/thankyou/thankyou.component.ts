import { Component, OnInit } from '@angular/core';
import { ProductResponseModel } from 'src/app/models/product/product.model';
import { Router } from '@angular/router';
import { OrderService } from 'src/app/services/order.service';

@Component({
  selector: 'app-thankyou',
  templateUrl: './thankyou.component.html',
  styleUrls: ['./thankyou.component.scss'],
})
export class ThankyouComponent implements OnInit {
  message: string;
  orderId: number;
  products: ProductResponseModel[] = [];
  cartTotal: number;

  constructor(private router: Router, private orderService: OrderService) {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation.extras.state as {
      message: string;
      products: ProductResponseModel[];
      orderId: number;
      total: number;
    };
    this.message = state.message;
    this.products = state.products;
    console.log(this.products);
    this.orderId = state.orderId;
    this.cartTotal = state.total;
  }

  ngOnInit(): void {}
}
