import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutPageComponent } from './pages/about-page.component';
import { DonatePageComponent } from './pages/donate-page.component';
import { EventsPageComponent } from './pages/events-page.component';
import { HomePageComponent } from './pages/home-page.component';
import { LoginPageComponent } from './pages/login-page.component';
import { BookPoojaPageComponent } from './pages/bookpooja-page.component';
import { RegisterPageComponent } from './pages/register-page.component';
import { SchedulePageComponent } from './pages/schedule-page.component';
import { VisitPageComponent } from './pages/visit-page.component';
import { ContactPageComponent } from './pages/contact-page-component';
import { AuthGuard } from './auth.guard';
import { ChangePasswordPageComponent } from './pages/change-password-page.component';

const routes: Routes = [
  { path: '', component: HomePageComponent },
  { path: 'history', component: AboutPageComponent },
  { path: 'pooja', component: SchedulePageComponent },
  { path: 'events', component: EventsPageComponent },
  { path: 'donate', component: DonatePageComponent },
  { path: 'visit', component: VisitPageComponent },
  { path: 'bookpooja', component: BookPoojaPageComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginPageComponent },
  { path: 'register', component: RegisterPageComponent, canActivate: [AuthGuard] },
  { path: 'change-password', component: ChangePasswordPageComponent, canActivate: [AuthGuard] },
  { path: 'contact', component: ContactPageComponent },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
