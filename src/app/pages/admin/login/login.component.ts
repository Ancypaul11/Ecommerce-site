import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent implements OnInit, OnDestroy {
  isSignDivVisiable: boolean = true;
  isLoading: boolean = false;
  errorMessage: string = '';

  signUpObj: SignUpModel = new SignUpModel();
  loginObj: LoginModel = new LoginModel();

  private destroy$ = new Subject<void>();

  constructor(
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // Initialize component if needed
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  async onRegister(): Promise<void> {
    if (!this.validateSignUpForm()) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.cdr.markForCheck();

    try {
      await this.performRegistration();
      alert('Registration Success');
      this.resetSignUpForm();
    } catch (error) {
      this.errorMessage = 'Registration failed. Please try again.';
      console.error('Registration error:', error);
    } finally {
      this.isLoading = false;
      this.cdr.markForCheck();
    }
  }

  async onLogin(): Promise<void> {
    if (!this.validateLoginForm()) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.cdr.markForCheck();

    try {
      await this.performLogin();
    } catch (error) {
      this.errorMessage = 'Login failed. Please check your credentials.';
      console.error('Login error:', error);
    } finally {
      this.isLoading = false;
      this.cdr.markForCheck();
    }
  }

  private async performRegistration(): Promise<void> {
    const users = await this.getStoredUsers();
    users.push(this.signUpObj);
    localStorage.setItem('users', JSON.stringify(users));
  }

  private async performLogin(): Promise<void> {
    const users = await this.getStoredUsers();
    const isUserPresent = users.find(
      (user: SignUpModel) =>
        user.email === this.loginObj.email &&
        user.password === this.loginObj.password
    );

    if (isUserPresent) {
      localStorage.setItem('loggedUser', JSON.stringify(isUserPresent));
      this.router.navigateByUrl('/AllProducts');
    } else {
      throw new Error('User not found');
    }
  }

  private async getStoredUsers(): Promise<SignUpModel[]> {
    return new Promise((resolve) => {
      const localUser = localStorage.getItem('users');
      if (localUser != null) {
        resolve(JSON.parse(localUser));
      } else {
        resolve([]);
      }
    });
  }

  private validateSignUpForm(): boolean {
    if (!this.signUpObj.name || !this.signUpObj.email || !this.signUpObj.password) {
      this.errorMessage = 'Please fill in all required fields.';
      this.cdr.markForCheck();
      return false;
    }

    if (this.signUpObj.password.length < 6) {
      this.errorMessage = 'Password must be at least 6 characters long.';
      this.cdr.markForCheck();
      return false;
    }

    return true;
  }

  private validateLoginForm(): boolean {
    if (!this.loginObj.email || !this.loginObj.password) {
      this.errorMessage = 'Please enter both email and password.';
      this.cdr.markForCheck();
      return false;
    }

    return true;
  }

  private resetSignUpForm(): void {
    this.signUpObj = new SignUpModel();
    this.cdr.markForCheck();
  }
}

export class SignUpModel {
  name: string;
  email: string;
  password: string;
  custId: number;

  constructor() {
    this.email = "";
    this.name = "";
    this.password = "";
    this.custId = 1404;
  }
}

export class LoginModel {
  email: string;
  password: string;

  constructor() {
    this.email = "";
    this.password = "";
  }
}
