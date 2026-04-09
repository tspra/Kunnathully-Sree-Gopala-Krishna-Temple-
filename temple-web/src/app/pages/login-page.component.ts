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

    this.contentService.login(this.formData).subscribe({
      next: (response) => {
        this.authService.setSession(response);
        this.successMessage = `${response.name} സ്വാഗതം. ലോഗിൻ വിജയകരമായി പൂർത്തിയായി.`;
        this.formData.password = '';
        this.isSubmitting = false;
        void this.router.navigate(['/']);
      },
      error: (error) => {
        this.errorMessage = error?.error?.message ?? 'ലോഗിൻ പരാജയപ്പെട്ടു. വിവരങ്ങൾ പരിശോധിച്ച് വീണ്ടും ശ്രമിക്കുക.';
        this.isSubmitting = false;
      }
    });
  }
}