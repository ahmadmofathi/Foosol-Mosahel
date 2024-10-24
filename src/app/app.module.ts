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
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    CKEditorModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
