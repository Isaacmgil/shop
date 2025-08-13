
import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth-service';
import { Observable, of, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-register-page',
  imports: [ReactiveFormsModule],
  templateUrl: './register-page.component.html',
})
export class RegisterPageComponent {

  formBuilder = inject(FormBuilder)
  hasError = signal(false);
  isPosting = signal(false);
  router = inject(Router);

  authService = inject(AuthService);
  private http = inject(HttpClient);


  registerForm = this.formBuilder.group({
    fullName: ['', [Validators.required, Validators.minLength(3),]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  onSubmit() {
    if(this.registerForm.invalid) {
      this.hasError.set(true)
      setTimeout(()=> {
        this.hasError.set(false);
      }, 2000);
      return;
    }

    const {fullName = '', email = '', password = ''} = this.registerForm.value;
    console.log({fullName, email, password});

    this.authService.register(fullName!, email!, password!).subscribe((isAuthenticated)=> {
      if( isAuthenticated) {
        this.router.navigateByUrl('/');
        return;
      }

      this.hasError.set(true);
      setTimeout(()=> {
        this.hasError.set(false);
      }, 2000);
    })
  }
}
