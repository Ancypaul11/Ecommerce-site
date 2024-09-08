import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { CheckboxModule } from 'primeng/checkbox';
import { FooterComponent } from '../footer/footer.component';
import { ProductData } from '../../../shared/data/product-data';
import { CategoryData } from '../../../shared/data/category-data';
@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [RouterOutlet, RouterLink, CommonModule, FormsModule, ConfirmDialogModule, ButtonModule, DialogModule, CheckboxModule, FooterComponent],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.css',
})
export class LandingComponent implements OnInit {
  @ViewChild('loginFrm') loginFrm!: NgForm;
  @ViewChild('registerFrm') registerFrm!: NgForm;
  productList: any[] = [];
  categoryList: any[] = [];
  cartList: any[] = [];
  loginObj: loginObject = new loginObject();
  userLoginObj: userLoginObject = new userLoginObject();
  registerObj: registerObject = new registerObject();
  profileObj: userProfileObject = new userProfileObject();
  loggedInObj: any = {};
  displayModalLogin: boolean = false;
  displayModalRegistration: boolean = false;
  displayModalProfile: boolean = false;
  rememberMe: boolean = false;
  showLoginPassword: boolean = false;
  showRegisterPassword: boolean = false;
  showProfilePassword: boolean = false;
  isApiCallInProgress: boolean = false;
  phonePattern: string = "^((\\+91-?)|0)?[0-9]{10}$";
  passwordPattern: any = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[\#?!@$%^&*\-])/;

  constructor(
    private router: Router, 
  ) {
    const localData = localStorage.getItem('loggedUser');
    if (localData !== null) {
      this.loggedInObj = JSON.parse(localData);
      this.getCartByCustomerId(this.loggedInObj.custId);
    }
    console.log(this.loggedInObj.custId)
  }

  ngOnInit(): void {
    this.getAllProducts();
    this.getAllCategory();
  }

  navigateToProducts(id: number) {
    this.router.navigate(['/products', id]);
  }

  remove(cartId: number) {
    const localData = localStorage.getItem('bigBasket_user');
    let data:any = [];
    if (localData !== null) {
      this.cartList.filter((cart) => {
        if (cart.productId == cartId) {
          this.cartList.splice(cart,1);
          data.push(cart);
        }
      })
      localStorage.setItem('bigBasket_user', JSON.stringify(data));
    }
  }

  getCartByCustomerId(custId: number) {
    this.cartList = [];
    const localData = localStorage.getItem('bigBasket_user');
    if (localData !== null) {
      const data = JSON.parse(localData);
      data.forEach((item:any) => {
          this.cartList.push(item);
      })
    } else {
      this.cartList = [];
    }
  }

  getAllProducts() {
    this.productList = ProductData;
  }


  getCustomerByCustomerId() {
  
  }


 login() {
  this.router.navigate(['/login']);
 }

 onLogOut() {
  localStorage.setItem('loggedUser', '');
  this.router.navigate(['/login']);
 }

  calculateTotalSubtotal() {
    let totalSubtotal = 0;
    for (const item of this.cartList) {
      totalSubtotal += (item.productPrice * item.quantity);
    }
    return totalSubtotal;
  }

  getAllCategory() {
      this.categoryList = CategoryData.filter((list: any) => list.parentCategoryId === 0);
  }

  

  loadSubcategories(parentCategory: any) {
    // Reset subcategories for all other parent categories
    this.categoryList.forEach((category: any) => {
      if (category !== parentCategory) {
        category.subcategories = undefined;
      }
    });
    // Fetch subcategories for the given parentCategoryId
    if (parentCategory.subcategories == undefined) {
      setTimeout(() => {
        // this.prodSrv.getCategory().subscribe((res: any) => {
          const subcategories = CategoryData.filter((list: any) => list.parentCategoryId === parentCategory.categoryId);
          // Update the corresponding parent category with subcategories
          parentCategory.subcategories = subcategories;
        //   // console.log(subcategories);
        // });
      }, 100);
    }
  }

  resetSubcategories() {
    // Reset subcategories for all parent categories
    this.categoryList.forEach((category: any) => {
      category.subcategories = undefined;
    });
  }
}

export class loginObject {
  UserName: string;
  UserPassword: string;

  constructor() {
    this.UserName = '';
    this.UserPassword = '';
  }
}

export class userLoginObject {
  EmailId: string;
  Password: string;

  constructor() {
    this.EmailId = 'rinku@gmail.com';
    this.Password = 'Rinku@1';
  }
}

export class registerObject {
  CustId: number;
  Name: string;
  MobileNo: string;
  Password: string;

  constructor() {
    this.CustId = 0;
    this.Name = '';
    this.MobileNo = '';
    this.Password = '';
  }
}

export class userProfileObject {
  custId: number;
  name: string;
  mobileNo: string;
  password: string;

  constructor() {
    this.custId = 0;
    this.name = '';
    this.mobileNo = '';
    this.password = '';
  }
}