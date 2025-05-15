import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginSignupComponent } from './components/login-signup/login-signup.component';
import { AuthService } from './services/auth-guard/auth.service';

const routes: Routes = [
  { path: '', redirectTo: 'auth', pathMatch: 'full' },  // open this on startup
  { path: 'auth', component: LoginSignupComponent },
  { path: '**', redirectTo: 'auth' }  // fallback route
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
