import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignupFormComponent } from './components/signup-form/signup-form.component';
import { LoginFormComponent } from './components/login-form/login-form.component';
import { HomeComponent } from './components/home/home.component';
import { SignUpComponent } from './sign-up/sign-up.component';

const routes: Routes = [
  {path:'signup', component:SignupFormComponent},
  {path:'hesham',component:SignUpComponent},
  {path:'login',component:LoginFormComponent},
  {path:'home',component:HomeComponent},
  {path:'',component:SignupFormComponent},
  {path:'**',component:SignupFormComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
