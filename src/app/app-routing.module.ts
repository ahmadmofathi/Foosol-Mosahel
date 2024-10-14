import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignupFormComponent } from './components/signup-form/signup-form.component';
import { LoginFormComponent } from './components/login-form/login-form.component';
import { HomeComponent } from './components/home/home.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { PaymentComponent } from './components/payment/payment/payment.component';
import { ApprovPaymentComponent } from './components/payment/approv-payment/approv-payment.component';
import { TeacherDashComponent } from './components/teacherDash/teacher-dash/teacher-dash.component';
import { SettingsComponent } from './components/settings/settings.component';

const routes: Routes = [
  {path:'login', component:SignupFormComponent},
  {path:'hesham',component:SignUpComponent},
  {path:'sign-up',component:LoginFormComponent},
  {path:'home',component:HomeComponent},
  {path:'payment',component:PaymentComponent},
  {path:'approve',component:ApprovPaymentComponent},
  {path:'teacherDash',component:TeacherDashComponent},
  {path:'settings',component:SettingsComponent},
  {path:'payment', component:PaymentComponent},
  {path:'approve', component:ApprovPaymentComponent},
  {path:'',component:SignupFormComponent},
  {path:'**',component:SignupFormComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
