import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private url = environment.serverURL;
  constructor(private http: HttpClient) {}

  /* get all products */
  getAllProducts(limitOfResults = 10) {
    return this.http.get(this.url + 'products', {
      params: {
        limit: limitOfResults.toString(),
      },
    });
  }
}
