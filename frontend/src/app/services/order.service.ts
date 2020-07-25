import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private products: ProductResponseModel[] = [];
  private url = environment.serverUrl;
  constructor(private http: HttpClient) {}
  getSingleOrder(orderId: number) {
    return this.http
      .get<ProductResponseModel[]>(this.url + 'orders/' + orderId)
      .toPromise();
  }
}

interface ProductResponseModel {
  id: number;
  title: string;
  description: string;
  price: number;
  quantityOrdered: number;
  image: string;
}
