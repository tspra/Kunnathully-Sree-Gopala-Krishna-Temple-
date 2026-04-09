import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { DonateInfo, DonationPlan, UpdateDonateInfoRequest } from '../temple-content.model';
import { TempleContentService } from '../temple-content.service';

@Component({
  selector: 'app-donate-page',
  templateUrl: './donate-page.component.html',
  styleUrls: ['./donate-page.component.scss']
})
export class DonatePageComponent implements OnInit {
  isAdmin = false;
  activeTab: 'view' | 'edit' | 'items' = 'view';
  donationPlans: DonationPlan[] = [];
  readonly donationImageUrl = 'assets/images/donate.png';
  donateInfo: DonateInfo = {
    bankAccountName: 'Kunnathulli Sree Gopalakrishna Kshethram',
    bankAccountNumber: '0000000000000000',
    bankIfscCode: 'XXXX0000000',
    upiImageUrl: 'assets/images/upi.png'
  };
  formData: UpdateDonateInfoRequest = {
    bankAccountName: '',
    bankAccountNumber: '',
    bankIfscCode: '',
    upiImageUrl: ''
  };
  selectedUpiFile: File | null = null;
  upiPreviewUrl = '';
  selectedDonationImageFile: File | null = null;
  donationImagePreviewUrl = 'assets/images/donate.png';
  donationForm = {
    title: '',
    description: '',
    imageUrl: 'assets/images/donate.png'
  };
  isAddingDonationItem = false;
  deletingDonationId: number | null = null;
  isImageModalOpen = false;
  selectedImageUrl = '';
  selectedImageDescription = '';
  selectedImageTitle = '';
  isSaving = false;
  statusMessage = '';
  statusMessageType: 'success' | 'error' = 'success';

  constructor(
    private readonly contentService: TempleContentService,
    private readonly authService: AuthService
  ) {}

  ngOnInit(): void {
    this.isAdmin = this.authService.isAdmin();
    this.loadDonationPlans();
    this.loadDonateInfo();
  }

  loadDonationPlans(): void {
    this.contentService.getDonationPlans().subscribe({
      next: (plans) => {
        this.donationPlans = plans;
      },
      error: () => {
        this.statusMessage = 'സംഭാവന ഇനങ്ങൾ ലോഡ് ചെയ്യാനായില്ല.';
        this.statusMessageType = 'error';
      }
    });
  }

  loadDonateInfo(): void {
    this.contentService.getDonateInfo().subscribe({
      next: (info: DonateInfo) => {
        this.donateInfo = info;
        this.formData = { ...info };
      },
      error: () => {
        this.statusMessage = 'സംഭാവന വിവരങ്ങൾ ലോഡ് ചെയ്യാനായില്ല.';
        this.statusMessageType = 'error';
      }
    });
  }

  setActiveTab(tab: 'view' | 'edit' | 'items'): void {
    this.activeTab = tab;
    this.statusMessage = '';
    if (tab === 'edit') {
      this.formData = { ...this.donateInfo };
      this.selectedUpiFile = null;
      this.upiPreviewUrl = this.donateInfo.upiImageUrl;
    }
  }

  cancelEdit(): void {
    this.formData = { ...this.donateInfo };
    this.selectedUpiFile = null;
    this.upiPreviewUrl = this.donateInfo.upiImageUrl;
    this.statusMessage = '';
    this.activeTab = 'view';
  }

  onDonationItemImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const files = input.files;
    this.selectedDonationImageFile = files && files.length > 0 ? files[0] : null;

    if (!this.selectedDonationImageFile) {
      this.donationImagePreviewUrl = this.donationForm.imageUrl;
      return;
    }

    this.donationImagePreviewUrl = URL.createObjectURL(this.selectedDonationImageFile);
  }

  addDonationItem(): void {
    if (!this.donationForm.title.trim()) {
      this.statusMessage = 'സംഭാവന ഇനത്തിന്റെ പേര് നൽകുക.';
      this.statusMessageType = 'error';
      return;
    }

    this.isAddingDonationItem = true;
    this.statusMessage = '';

    const createItem = (imageUrl: string) => {
      this.contentService.createDonationPlan({
        title: this.donationForm.title.trim(),
        description: this.donationForm.description.trim(),
        imageUrl
      }).subscribe({
        next: (createdPlan) => {
          this.donationPlans = [...this.donationPlans, createdPlan];
          this.donationForm = {
            title: '',
            description: '',
            imageUrl: 'assets/images/donate.png'
          };
          this.selectedDonationImageFile = null;
          this.donationImagePreviewUrl = 'assets/images/donate.png';
          this.isAddingDonationItem = false;
          this.statusMessage = 'സംഭാവന ഇനം വിജയകരമായി ചേർത്തു.';
          this.statusMessageType = 'success';
        },
        error: (err) => {
          this.isAddingDonationItem = false;
          this.statusMessageType = 'error';
          this.statusMessage = err?.error?.message || 'സംഭാവന ഇനം ചേർക്കാൻ കഴിഞ്ഞില്ല.';
        }
      });
    };

    if (this.selectedDonationImageFile) {
      this.contentService.uploadDonationPlanImage(this.selectedDonationImageFile).subscribe({
        next: (uploadResult) => {
          createItem(uploadResult.imageUrl);
        },
        error: (err) => {
          this.isAddingDonationItem = false;
          this.statusMessageType = 'error';
          this.statusMessage = err?.error?.message || 'ചിത്രം അപ്‌ലോഡ് ചെയ്യാൻ കഴിഞ്ഞില്ല.';
        }
      });
      return;
    }

    createItem(this.donationForm.imageUrl || 'assets/images/donate.png');
  }

  deleteDonationItem(item: DonationPlan): void {
    if (!item.id) {
      this.statusMessage = 'ഡിലീറ്റ് ചെയ്യാൻ ഇനത്തിന്റെ ഐഡി ലഭ്യമല്ല.';
      this.statusMessageType = 'error';
      return;
    }

    this.deletingDonationId = item.id;
    this.statusMessage = '';

    this.contentService.deleteDonationPlan(item.id).subscribe({
      next: () => {
        this.donationPlans = this.donationPlans.filter((plan) => plan.id !== item.id);
        this.deletingDonationId = null;
        this.statusMessage = 'സംഭാവന ഇനം ഡിലീറ്റ് ചെയ്തു.';
        this.statusMessageType = 'success';
      },
      error: (err) => {
        this.deletingDonationId = null;
        this.statusMessageType = 'error';
        this.statusMessage = err?.error?.message || 'സംഭാവന ഇനം ഡിലീറ്റ് ചെയ്യാൻ കഴിഞ്ഞില്ല.';
      }
    });
  }

  openImageModal(item: DonationPlan): void {
    this.selectedImageUrl = item.imageUrl || this.donationImageUrl;
    this.selectedImageDescription = item.description || 'വിവരണം ലഭ്യമല്ല.';
    this.selectedImageTitle = item.title || 'സംഭാവന ഇനം';
    this.isImageModalOpen = true;
  }

  closeImageModal(): void {
    this.isImageModalOpen = false;
    this.selectedImageUrl = '';
    this.selectedImageDescription = '';
    this.selectedImageTitle = '';
  }

  onUpiFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const files = input.files;
    this.selectedUpiFile = files && files.length > 0 ? files[0] : null;

    if (!this.selectedUpiFile) {
      this.upiPreviewUrl = this.formData.upiImageUrl;
      return;
    }

    this.upiPreviewUrl = URL.createObjectURL(this.selectedUpiFile);
  }

  submit(): void {
    if (!this.formData.bankAccountName.trim() || !this.formData.bankAccountNumber.trim() || !this.formData.bankIfscCode.trim()) {
      this.statusMessage = 'എല്ലാ ഫീൽഡുകളും പൂരിപ്പിക്കേണ്ടതാണ്.';
      this.statusMessageType = 'error';
      return;
    }

    this.isSaving = true;
    this.statusMessage = '';

    const updateTextInfo = () => {
      this.contentService.updateDonateInfo(this.formData).subscribe({
        next: (updatedInfo: DonateInfo) => {
          this.donateInfo = updatedInfo;
          this.formData = { ...updatedInfo };
          this.selectedUpiFile = null;
          this.upiPreviewUrl = updatedInfo.upiImageUrl;
          this.isSaving = false;
          this.statusMessage = 'സംഭാവന വിവരങ്ങൾ വിജയകരമായി അപ്ഡേറ്റ് ചെയ്തു.';
          this.statusMessageType = 'success';
          this.activeTab = 'view';
        },
        error: (err) => {
          this.isSaving = false;
          this.statusMessageType = 'error';
          this.statusMessage = err?.error?.message || 'സംഭാവന വിവരങ്ങൾ അപ്ഡേറ്റ് ചെയ്യാൻ കഴിഞ്ഞില്ല.';
        }
      });
    };

    if (this.selectedUpiFile) {
      this.contentService.uploadDonateUpiImage(this.selectedUpiFile).subscribe({
        next: (updatedInfo: DonateInfo) => {
          this.formData.upiImageUrl = updatedInfo.upiImageUrl;
          updateTextInfo();
        },
        error: (err) => {
          this.isSaving = false;
          this.statusMessageType = 'error';
          this.statusMessage = err?.error?.message || 'UPI ചിത്രം അപ്‌ലോഡ് ചെയ്യാൻ കഴിഞ്ഞില്ല.';
        }
      });
      return;
    }

    updateTextInfo();
  }
}
