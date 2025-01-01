import { Component } from '@angular/core';

@Component({
  selector: 'app-sign-student',
  templateUrl: './sign-student.component.html',
  styleUrls: ['./sign-student.component.css']
})
export class SignStudentComponent {
  selectedRole: string = 'student'; // Default selected role

  selectRole(role: string) {
    this.selectedRole = role;
  }

}
