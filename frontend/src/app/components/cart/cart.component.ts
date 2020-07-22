import { Component, OnInit } from '@angular/core';
import { CartModelServer } from 'src/app/models/carts/cart.model';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
})
export class CartComponent implements OnInit {
  cartData: CartModelServer;
  cartTotal: number;
  subTotal: number;
  constructor(public cartService: CartService) {}

  ngOnInit(): void {
    this.cartService.cartDataObs$.subscribe((data: CartModelServer) => {
      this.cartData = data;
    });
    this.cartService.cartTotal$.subscribe((total) => (this.cartTotal = total));
  }
  ChangeQuantity(index: number, increase: boolean) {
    console.log(this.cartData.data[index].numInCart);
    if (increase) {
      this.cartService.UpdateCartItem(index, increase);
    } else if (this.cartData.data[index].numInCart > 1 && !increase) {
      this.cartService.UpdateCartItem(index, increase);
    } else {
      alert('Please remove the item!');
    }
  }
}
