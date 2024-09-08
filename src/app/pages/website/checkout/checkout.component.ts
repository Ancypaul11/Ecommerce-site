import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterOutlet, RouterLink],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent implements OnInit {
  loggedInObj: any = {};
  cartItem: any[] = [];
  placeOrderObj: placeOrderObject = new placeOrderObject();
  isApiCallInProgress: boolean = false;

  constructor(
    private router: Router, 
  ) {
    const localData = localStorage.getItem('loggedUser');
    if (localData !== null) {
      const parseObj = JSON.parse(localData);
      this.loggedInObj = parseObj;
      this.getCartByCustomerId(this.loggedInObj.custId);
    }
  }

  ngOnInit(): void {
  }

  getCartByCustomerId(custId: number) {
    this.cartItem = [];
    const localData = localStorage.getItem('bigBasket_user');
    if (localData !== null) {
      const data = JSON.parse(localData);
      if(data.length > 0) {
      data.forEach((item:any) => {
          this.cartItem.push(item);
      })
    }
    } else {
      this.cartItem = [];
    }
  }

  placeCartOrder(placeOrderFrm: NgForm) {
    if (placeOrderFrm.valid) {
      console.log(placeOrderFrm.value);
    } else {
      Object.values(placeOrderFrm.controls).forEach((control: any) => {
        control.markAsTouched();
      });
    }
  }

  calculateTotalSubtotal() {
    let totalSubtotal = 0;
    for (const item of this.cartItem) {
      totalSubtotal += (item.productPrice * item.quantity);
    }
    return totalSubtotal;
  }

  deleteProductFromCartById(cartId: number) {
    const localData = localStorage.getItem('bigBasket_user');
    let data:any = [];
    if (localData !== null) {
      this.cartItem.filter((cart) => {
        if (cart.productId == cartId) {
          this.cartItem.splice(cart,1);
          data.push(cart);
        }
      })
      localStorage.setItem('bigBasket_user', JSON.stringify(data));
    }
    if(this.cartItem.length == 0) {
      localStorage.setItem('bigBasket_user', '[]');
    }
  }
}

export class placeOrderObject {
  SaleId: number;
  CustId: number;
  SaleDate: Date;
  TotalInvoiceAmount: number;
  Discount: number;
  PaymentNaration: string;
  DeliveryAddress1: string;
  DeliveryAddress2: string;
  DeliveryCity: string;
  DeliveryPinCode: string;
  DeliveryLandMark: string;

  constructor() {
    this.SaleId = 0;
    this.CustId = 0;
    this.SaleDate = new Date();
    this.TotalInvoiceAmount = 0;
    this.Discount = 0;
    this.PaymentNaration = '';
    this.DeliveryAddress1 = '';
    this.DeliveryAddress2 = '';
    this.DeliveryCity = '';
    this.DeliveryPinCode = '';
    this.DeliveryLandMark = '';
  }
}