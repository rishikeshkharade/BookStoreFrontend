import { Component } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { UserService } from 'src/app/services/user/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { LoaderService } from 'src/app/services/loader/loader.service';


@Component({
  selector: 'app-login-signup',
  templateUrl: './login-signup.component.html',
  styleUrls: ['./login-signup.component.scss']
})
export class LoginSignupComponent {
  tabIndex = 0;
  loginForm: FormGroup;
  signupForm: FormGroup;
  loading = false;
  error: string | null = null;
  hide = true;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private snackBar: MatSnackBar,
    private router: Router,
    private loader: LoaderService
  ) {
       this.loginForm = this.fb.group({
      email:    ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });

    this.signupForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(3)]],
      email:    ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]]
    });
  }

onLogin(): void {
    if (this.loginForm.invalid) { this.loginForm.markAllAsTouched(); return; }

    this.loader.show(); // Show global spinner
  this.error = null;

    this.userService.login(this.loginForm.value).subscribe({
      next: (res) => { this.loader.hide();

        localStorage.setItem('accessToken', res.data.accessToken);
        localStorage.setItem('refreshToken', res.data.refreshToken);
       
      this.snackBar.open('Login successful!', '', { duration: 3000, panelClass: ['green-snackbar'] });

        this.router.navigate(['/dashboard']); // Redirect to home or dashboard
      
      },
      error: (err) => { this.loader.hide(); this.error = err.error?.message || 'Login failed'; 
        this.snackBar.open(this.error ?? 'Something went wrong', '', { duration: 3000, panelClass: ['red-snackbar'] });
      }
    });
  }

onSignup(): void {
    if (this.signupForm.invalid) { this.signupForm.markAllAsTouched(); return; }

  this.loader.show(); // Show global spinner
  this.error = null;

    this.userService.signup(this.signupForm.value).subscribe({
      next: () => { this.loader.hide(); /* switch to login tab or auto-login */ 

        this.snackBar.open('Signup successful! Please login.', '', { duration: 3000, panelClass: ['green-snackbar'] });
        this.tabIndex = 0; // Switch to login tab     
        },
      error: err => { this.loader.hide(); this.error = err.error?.message || 'Signup failed';
        this.snackBar.open(this.error ?? 'Something went wrong', '', { duration: 3000, panelClass: ['red-snackbar'] });
       }
    });
  }
  }
  