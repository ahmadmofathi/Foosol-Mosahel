import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from 'src/app/services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-signup-form',
  templateUrl: './signup-form.component.html',
  styleUrls: ['./signup-form.component.css'],
})
export class SignupFormComponent {
  loginForm: FormGroup;
  private authToken ='authToken'

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private http: HttpClient,
    private toastr: ToastrService,
  ) {
    this.loginForm = this.fb.group({
      phone: ['', Validators.required],
      password: ['', Validators.required],
    });
  }


  selectedRole: string = 'teacher'; // Default selected role

  selectRole(role: string) {
    this.selectedRole = role;
  }

  isPasswordVisible: boolean = false;
  togglePasswordVisibility(): void {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  errorMessage: string = '';
  login() {
    this.errorMessage = '';
    console.log(this.loginForm.value); // Debugging
    this.authService.login(this.loginForm.value).subscribe(
      (response) => {
        this.toastr.success('تم تسجيل الدخول بنجاح !', 'Success');
        console.log('Login successful', response);
        localStorage.setItem(this.authToken, response.token);
        this.loginForm.reset()
        this.router.navigate(['/main']);
      },
      (error) => {
        console.error('Login failed', error);
        this.errorMessage = error.error;
      }
    );
  }
}
