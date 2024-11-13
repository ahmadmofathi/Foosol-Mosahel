import { Component } from '@angular/core';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent {
  role: string = 'supervisor';  // Default role
  formData = {
    accessCode: '',
    email: '',
    password: '',
    confirmPassword: ''
  };

  setRole(role: string) {
    this.role = role;
  }

  onSubmit() {
    // Handle form submission
    console.log('Form Data:', this.formData);
    console.log('Selected Role:', this.role);
  }
}
