import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ProductService } from './product.service';
import { OrderService } from './order.service';
import { environment } from 'src/environments/environment';
import { CartModelPublic, CartModelServer } from '../models/carts/cart.model';
import { BehaviorSubject } from 'rxjs';
import { Router, NavigationExtras } from '@angular/router';
import { ProductModelServer } from '../models/product/product.model';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private url = environment.serverUrl;
  // Data variable to store the cart info on the client's local storage
  private cartDataClient: CartModelPublic = {
    total: 0,
    prodData: [
      {
        incart: 0,
        id: 0,
      },
    ],
  };
  // Data variable to store cart info on the server
  private cartDataServer: CartModelServer = {
    total: 0,
    data: [
      {
        numInCart: 0,
        product: undefined,
      },
    ],
  };

  // Observable for the components to subscribe
  cartTotal$ = new BehaviorSubject<number>(0);
  cartDataObs$ = new BehaviorSubject<CartModelServer>(this.cartDataServer);
  constructor(
    private http: HttpClient,
    private productService: ProductService,
    private orderService: OrderService,
    private router: Router
  ) {
    this.cartTotal$.next(this.cartDataServer.total);
    this.cartDataObs$.next(this.cartDataServer);

    // Get the information from local storage (if any)
    let info: CartModelPublic = JSON.parse(localStorage.getItem('cart'));

    //check if info has some data in it
    if (info !== null && info !== undefined && info.prodData[0].incart !== 0) {
      //assign to local storage
      this.cartDataClient = info;

      // loop through each entry and put in the cartDataServer obbject
      this.cartDataClient.prodData.forEach((p) => {
        this.productService
          .getSingleProduct(p.id)
          .subscribe((actualProductInfo: ProductModelServer) => {
            if (this.cartDataServer.data[0].numInCart === 0) {
              this.cartDataServer.data[0].numInCart = p.incart;
              this.cartDataServer.data[0].product = actualProductInfo;
              // TODO Create CalculateTotal Function
              this.cartDataClient.total = this.cartDataServer.total;
              localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
            } else {
              // CartDataServer already has some data
              this.cartDataServer.data.push({
                numInCart: p.incart,
                product: actualProductInfo,
              });
              // TODO Create CaculateTotal Function
              this.cartDataClient.total = this.cartDataServer.total;
              localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
            }
            this.cartDataObs$.next({ ...this.cartDataServer });
          });
      });
    } else {
      localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
    }
  }

  AddProductToCart(id: number, quantity?: number) {
    this.productService.getSingleProduct(id).subscribe((prod) => {
      // 1.  If the cart is empty
      // console.log(prod);
      if (this.cartDataServer.data[0].product === undefined) {
        this.cartDataServer.data[0].product = prod;
        this.cartDataServer.data[0].numInCart =
          quantity !== undefined ? quantity : 1;
        // console.log(this.cartDataServer);
        // calculate total amount
        this.CalculateTotal();
        this.cartDataClient.prodData[0].incart = this.cartDataServer.data[0].numInCart;
        this.cartDataClient.prodData[0].id = prod.prod.id;
        this.cartDataClient.total = this.cartDataServer.total;
        localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
        this.cartDataObs$.next({ ...this.cartDataServer });
        //TODO display a toast notification
      }

      // 2. If the cart has some items
      else {
        let index = this.cartDataServer.data.findIndex(
          (p) => p.product.prod.id === prod.prod.id
        );
        console.log(index);
        // if the chosen product is already in cart array
        if (index !== -1) {
          if (quantity !== undefined && quantity <= prod.prod.quantity) {
            this.cartDataServer.data[index].numInCart =
              this.cartDataServer.data[index].numInCart < prod.prod.quantity
                ? quantity
                : prod.prod.quantity;
          } else {
            this.cartDataServer.data[index].numInCart < prod.prod.quantity
              ? this.cartDataServer.data[index].numInCart++
              : prod.prod.quantity;
          }
        }
        // if chosen product is not in cart array
        else {
          this.cartDataServer.data.push({
            product: prod,
            numInCart: 1,
          });
          this.cartDataClient.prodData.push({
            incart: 1,
            id: prod.prod.id,
          });
        }
        //TODO display a toast notification
        //Calculate total amount
        this.CalculateTotal();
        this.cartDataClient.total = this.cartDataServer.total;
        localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
        this.cartDataObs$.next({ ...this.cartDataServer });
      }
    });
  }
  // UpdateCartItem(index, increase: boolean) {
  //   let data = this.cartDataServer.data[index];
  //   // if the cart is empty
  //   if (increase) {
  //     data.numInCart < data.product.quantity
  //       ? data.numInCart++
  //       : data.product.quantity;
  //     this.cartDataClient.prodData[index].incart = data.numInCart;
  //     // TODO Calculate the total amount
  //     this.cartDataClient.total = this.cartDataServer.total;
  //     this.cartDataObs$.next({ ...this.cartDataServer });
  //     localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
  //   } else {
  //     data.numInCart--;

  //     if (data.numInCart < 1) {
  //       // TODO delete method
  //       this.cartDataObs$.next({ ...this.cartDataServer });
  //       this.cartDataClient.prodData[index].incart = data.numInCart;
  //       // TODO calculate the total amount
  //       this.cartDataClient.total = this.cartDataServer.total;
  //       localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
  //     }
  //   }
  // }
  // DeleteProductFromCart(index) {
  //   if (window.confirm('Are you sure you want to delete the item?')) {
  //     this.cartDataServer.data.splice(index, 1);
  //     this.cartDataClient.prodData.splice(index, 1);
  //     // TODO calculate
  //     this.cartDataClient.total = this.cartDataServer.total;
  //     if (this.cartDataClient.total === 0) {
  //       this.cartDataClient = { prodData: [{ incart: 0, id: 0 }], total: 0 };
  //       localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
  //     } else {
  //       localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
  //     }
  //     if (this.cartDataServer.total === 0) {
  //       this.cartDataServer = {
  //         data: [
  //           {
  //             product: undefined,
  //             numInCart: 0,
  //           },
  //         ],
  //         total: 0,
  //       };
  //       this.cartDataObs$.next({ ...this.cartDataServer });
  //     } else {
  //       this.cartDataObs$.next({ ...this.cartDataServer });
  //     }
  //   }
  //   // if the user doesnt want to delete the product, hits the CANCEL button
  //   else {
  //     return;
  //   }
  // }
  // CheckoutFromCart(userId: number) {
  //   this.http
  //     .post(`${this.url}orders/payment`, null)
  //     .subscribe((res: { success: boolean }) => {
  //       if (res.success) {
  //         this.resetServerData();
  //         this.http
  //           .post(`${this.url}orders/new`, {
  //             userId: userId,
  //             products: this.cartDataClient.prodData,
  //           })
  //           .subscribe((data: OrderConfirmationResponse) => {
  //             this.orderService.getSingleOrder(data.order_id).then((prods) => {
  //               if (data.success) {
  //                 const navigationExtras: NavigationExtras = {
  //                   state: {
  //                     message: data.success,
  //                     products: prods,
  //                     orderId: data.order_id,
  //                     total: this.cartDataClient.total,
  //                   },
  //                 };
  //                 // TODO Spiner
  //                 this.router
  //                   .navigate(['/thankyou'], navigationExtras)
  //                   .then((p) => {
  //                     this.cartDataClient = {
  //                       prodData: [{ incart: 0, id: 0 }],
  //                       total: 0,
  //                     };
  //                     this.cartTotal$.next(0);
  //                     localStorage.setItem(
  //                       'cart',
  //                       JSON.stringify(this.cartDataClient)
  //                     );
  //                   });
  //               } else {
  //                 //TODO add spinner
  //                 this.router.navigateByUrl('/checkout').then();
  //                 //TODO add toaster
  //               }
  //             });
  //           });
  //       }
  //     });
  // }
  private CalculateTotal() {
    let Total = 0;
    this.cartDataServer.data.forEach((p) => {
      // console.log(p);
      let numInCart = p.numInCart;
      // console.log(numInCart);
      // console.log(typeof numInCart);
      let price = p.product.prod.price;
      // console.log(price);
      // console.log(typeof price);
      Total += numInCart * price;
    });
    // console.log(Total);
    this.cartDataServer.total = Total;
    this.cartTotal$.next(this.cartDataServer.total);
    console.log(this.cartTotal$.value);
  }
  private resetServerData() {
    this.cartDataServer = {
      data: [
        {
          product: undefined,
          numInCart: 0,
        },
      ],
      total: 0,
    };
    this.cartDataObs$.next({ ...this.cartDataServer });
  }
}

interface OrderConfirmationResponse {
  order_id: number;
  success: boolean;
  message: string;
  products: [
    {
      id: string;
      numInCart: string;
    }
  ];
}
