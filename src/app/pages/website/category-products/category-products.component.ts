import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CardComponent } from '../../../shared/components/card/card.component';
import { ProductData } from '../../../shared/data/product-data';
@Component({
  selector: 'app-category-products',
  standalone: true,
  imports: [CommonModule, CardComponent],
  templateUrl: './category-products.component.html',
  styleUrl: './category-products.component.css'
})
export class CategoryProductsComponent {
  activeCategoryId: number = 0;
  products: any[] = [];
  loggedInObj: any = {};
  isAddToCartApiCallInProgress: boolean = false;

  constructor(
      private activatedRoute: ActivatedRoute, 
      private router: Router, 
      ) {
    this.activatedRoute.params.subscribe((res: any) => {
      this.activeCategoryId = res.id;
      this.loadProducts();
    });

    const localData = sessionStorage.getItem('loggedUser');
    if (localData !== null) {
      const parseObj = JSON.parse(localData);
      this.loggedInObj = parseObj;
    }
  }

  loadProducts() {
    this.products = [];
    ProductData.forEach((product:any) => {
      if (product.categoryId == this.activeCategoryId) {
        this.products.push(product);
      }
    })
  }

  addToCart(product: any) {
    const localData = localStorage.getItem('bigBasket_user');
    if (localData !== null) {
      this.loggedInObj = JSON.parse(localData);
      const addToCartObj = {
        "cartId": 0,
        "custId": this.loggedInObj.custId,
        "productId": product.productId,
        "quantity": product.quantity || 1,
        "addedDate": new Date(),
        "productImageUrl": product.productImageUrl,
        "productShortName": product.productShortName,
        "productPrice": product.productPrice
      };
      this.loggedInObj.push(addToCartObj);
      console.log(this.loggedInObj)
      localStorage.setItem('bigBasket_user', JSON.stringify(this.loggedInObj));
    }
    else {
      this.loggedInObj = [];
      const addToCartObj = {
       "cartId": 0,
        "custId": this.loggedInObj.custId,
        "productId": product.productId,
        "quantity": product.quantity || 1,
        "addedDate": new Date(),
        "productImageUrl": product.productImageUrl,
        "productShortName": product.productShortName,
        "productPrice": product.productPrice
      };
      this.loggedInObj.push(addToCartObj);
      localStorage.setItem('bigBasket_user', JSON.stringify(this.loggedInObj));
    }
  }

  increment(product: any) {
    if (!product.quantity) {
      product.quantity = 1;
    } else {
      product.quantity++;
    }
  }

  decrementQuantity(product: any) {
    if (product.quantity && product.quantity > 1) {
      product.quantity--;
    }
  }

  getQuantity(product: any): number {
    return product.quantity || 1;
  }

}