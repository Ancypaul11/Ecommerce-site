import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CardComponent } from '../../../shared/components/card/card.component';
import { OfferCardComponent } from '../../../shared/components/offer-card/offer-card.component';
import { Observable } from 'rxjs';
import { ProductData } from '../../../shared/data/product-data';
import { CategoryData } from '../../../shared/data/category-data';
@Component({
  selector: 'web-products-products',
  standalone: true,
  imports: [CommonModule, RouterLink, CardComponent, OfferCardComponent],
  templateUrl: './web-products.component.html',
  styleUrl: './web-products.component.css'
})
export class WebProductsComponent {
  @ViewChild('productContainer') productContainer!: ElementRef;
  productList: any[] = [];
  categoryList: any[] = [];
  loggedInObj: any = {};
  currentIndex = 0;
  productsToShow: any[] = [];

  constructor(
    private router: Router, 
  ) {
    const localData = localStorage.getItem('loggedUser');
    if (localData !== null) {
      const parseObj = JSON.parse(localData);
      this.loggedInObj = parseObj;
    }
  }

  ngOnInit(): void {
    this.getAllProducts();
    this.getAllCategory();
  }

  navigateToProducts(id: number) {
    this.router.navigate(['/products', id]);
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
      localStorage.setItem('bigBasket_user', JSON.stringify(this.loggedInObj));
      this.router.navigate(['/checkout']);
    } else {
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
      this.router.navigate(['/checkout']);
    }
  }

  getAllProducts() {
    this.productList = ProductData;
      this.productList = ProductData;
      this.productsToShow = this.productList.slice(this.currentIndex, this.currentIndex + 4);
  }

  getAllCategory() {
      this.categoryList = CategoryData.filter((list: any) => list.parentCategoryId === 0);
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

  nextProduct() {
    this.currentIndex += 3;  // Increment index by 3
    this.productsToShow = this.productList.slice(this.currentIndex, this.currentIndex + 3);  // Update products to show
  }

  previousProduct() {
    this.currentIndex -= 3; // Decrement index by 3
    this.productsToShow = this.productList.slice(this.currentIndex, this.currentIndex + 3);// Update products to show
  }


  isPreviousDisabled(): boolean {
    return this.currentIndex <= 0;
  }

  isNextDisabled(): boolean {
    return this.currentIndex + 3 >= this.productList.length;
  }

}