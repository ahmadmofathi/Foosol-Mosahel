import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent {

  signUpForm: FormGroup;
   userType: string = 'student';

   constructor(private fb: FormBuilder) {
      this.signUpForm = this.fb.group({
         fullName: ['', Validators.required],
         countryCode: ['+966', Validators.required],
         phoneNumber: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
         password: ['', [Validators.required, Validators.minLength(6)]],
         confirmPassword: ['', Validators.required],
         terms: [false, Validators.requiredTrue]
      });
   }

   onSubmit() {
      if (this.signUpForm.valid) {
         console.log("Form Submitted", this.signUpForm.value);
      } else {
         console.log("Form is invalid");
      }
   }

}
