import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { LoginRequest } from '../temple-content.model';
import { TempleContentService } from '../temple-content.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent {
  formData: LoginRequest = {
    emailOrMobile: '',
    password: ''
  };
  isSubmitting = false;
  successMessage = '';
  errorMessage = '';

  constructor(
    private readonly contentService: TempleContentService,
    private readonly authService: AuthService,
    private readonly router: Router
  ) {}

  submit(): void {
    this.successMessage = '';
    this.errorMessage = '';
    this.isSubmitting = true;

    console.log('Login attempt with:', { emailOrMobile: this.formData.emailOrMobile });

    this.contentService.login(this.formData).subscribe({
      next: (response) => {
        console.log('Login successful:', response);
        this.authService.setSession(response);
        this.successMessage = `${response.name} സ്വാഗതം. ലോഗിൻ വിജയകരമായി പൂർത്തിയായി.`;
        this.formData.password = '';
        this.isSubmitting = false;
        setTimeout(() => {
          void this.router.navigate(['/']);
        }, 1000);
      },
      error: (error) => {
        console.error('Login error:', error);
        const errorMsg = error?.error?.message || error?.message || 'ലോഗിൻ പരാജയപ്പെട്ടു. വിവരങ്ങൾ പരിശോധിച്ച് വീണ്ടും ശ്രമിക്കുക.';
        this.errorMessage = errorMsg;
        this.isSubmitting = false;
      }
    });
  }
}