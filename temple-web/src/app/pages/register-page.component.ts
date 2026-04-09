import { Component } from '@angular/core';
import { RegisterAccountRequest } from '../temple-content.model';
import { TempleContentService } from '../temple-content.service';

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.scss']
})
export class RegisterPageComponent {
  formData: RegisterAccountRequest = {
    name: '',
    address: '',
    email: '',
    mobileNumber: '',
    password: ''
  };
  isSubmitting = false;
  successMessage = '';
  errorMessage = '';

  constructor(private readonly contentService: TempleContentService) {}

  submit(): void {
    this.successMessage = '';
    this.errorMessage = '';
    this.isSubmitting = true;

    this.contentService.registerAccount(this.formData).subscribe({
      next: (response) => {
        this.successMessage = `${response.name} എന്ന പേരിൽ അക്കൗണ്ട് വിജയകരമായി സൃഷ്ടിച്ചു.`;
        this.formData = {
          name: '',
          address: '',
          email: '',
          mobileNumber: '',
          password: ''
        };
        this.isSubmitting = false;
      },
      error: (error) => {
        this.errorMessage = error?.error?.message ?? 'അക്കൗണ്ട് സൃഷ്ടിക്കാൻ കഴിഞ്ഞില്ല. വീണ്ടും ശ്രമിക്കുക.';
        this.isSubmitting = false;
      }
    });
  }
}