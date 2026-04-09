import { NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
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
import { AuthInterceptor } from './auth.interceptor';
import { ChangePasswordPageComponent } from './pages/change-password-page.component';

@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent,
    LoginPageComponent,
    BookPoojaPageComponent,
    RegisterPageComponent,
    AboutPageComponent,
    SchedulePageComponent,
    EventsPageComponent,
    DonatePageComponent,
    VisitPageComponent,
    ContactPageComponent,
    ChangePasswordPageComponent
  ],
  imports: [
    HttpClientModule,
    FormsModule,
    BrowserModule,
    AppRoutingModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
