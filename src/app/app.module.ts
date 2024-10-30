import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SignupFormComponent } from './components/signup-form/signup-form.component';
import { LoginFormComponent } from './components/login-form/login-form.component';
import { HomeComponent } from './components/home/home.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PaymentComponent } from './components/payment/payment/payment.component';
import { ApprovPaymentComponent } from './components/payment/approv-payment/approv-payment.component';
import { TeacherDashComponent } from './components/teacherDash/teacher-dash/teacher-dash.component';
import { SettingsComponent } from './components/settings/settings.component';
import { ProfileComponent } from './components/profile/profile.component';
import {CKEditorModule} from '@ckeditor/ckeditor5-angular'
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MainComponent } from './components/main/main.component';
import { StudentComponent } from './components/student/student.component';
import { PaperComponent } from './components/paper/paper.component';
import { ExamComponent } from './components/exam/exam.component';
import { ClassComponent } from './components/class/class.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StudentProfileComponent } from './components/student-profile/student-profile.component';
import { SignStudentComponent } from './components/sign-student/sign-student.component';
import { LoginStudentComponent } from './components/login-student/login-student.component';
import { PolicyComponent } from './components/policy/policy.component';
import { CovenantsComponent } from './components/covenants/covenants.component';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { PrepExamComponent } from './prep-exam/prep-exam.component';

@NgModule({
  declarations: [
    AppComponent,
    SignupFormComponent,
    LoginFormComponent,
    HomeComponent,
    SignUpComponent,
    PaymentComponent,
    ApprovPaymentComponent,
    TeacherDashComponent,
    SettingsComponent,
    ProfileComponent,
    MainComponent,
    StudentComponent,
    PaperComponent,
    ExamComponent,
    ClassComponent,
    StudentProfileComponent,
    SignStudentComponent,
    LoginStudentComponent,
    PolicyComponent,
    CovenantsComponent,
    PrepExamComponent,
    
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    CKEditorModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatChipsModule,
    MatIconModule,
    RouterModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
