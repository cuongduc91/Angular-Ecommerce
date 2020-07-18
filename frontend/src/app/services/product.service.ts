import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ServerResponse } from 'http';
import { ProductModelServer } from '../models/product/product.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private url = environment.serverURL;
  constructor(private http: HttpClient) {}

  /* get all products */
  getAllProducts(limitOfResults = 10): Observable<ServerResponse> {
    return this.http.get<ServerResponse>(this.url + 'products', {
      params: {
        limit: limitOfResults.toString(),
      },
    });
  }

  // GET single product from server
  getSingleProduct(id: number): Observable<ProductModelServer> {
    return this.http.get<ProductModelServer>(this.url + '/products' + id);
  }
}
