import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { TempleContentService } from '../temple-content.service';
import { ChangePasswordRequest } from '../temple-content.model';

@Component({
  selector: 'app-change-password-page',
  templateUrl: './change-password-page.component.html',
  styleUrls: ['./change-password-page.component.scss']
})
export class ChangePasswordPageComponent {
  formData: ChangePasswordRequest = { currentPassword: '', newPassword: '' };
  confirmPassword = '';
  successMessage = '';
  errorMessage = '';
  isSubmitting = false;

  constructor(
    private readonly contentService: TempleContentService,
    private readonly router: Router
  ) {}

  onSubmit(pwForm: NgForm): void {
    if (this.formData.newPassword !== this.confirmPassword) {
      this.successMessage = '';
      this.errorMessage = 'New passwords do not match.';
      return;
    }

    this.isSubmitting = true;
    this.successMessage = '';
    this.errorMessage = '';

    this.contentService.changePassword(this.formData).subscribe({
      next: (res) => {
        this.successMessage = res.message;
        this.isSubmitting = false;
        this.formData = { currentPassword: '', newPassword: '' };
        this.confirmPassword = '';
        pwForm.resetForm({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
        setTimeout(() => void this.router.navigate(['/']), 2000);
      },
      error: (err) => {
        this.errorMessage = err?.error?.message ?? 'Failed to change password. Please try again.';
        this.isSubmitting = false;
      }
    });
  }
}
