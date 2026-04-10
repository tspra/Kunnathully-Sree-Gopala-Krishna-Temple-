import { Component, HostListener, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { TempleContentService } from '../temple-content.service';
import { GalleryImage, VisitInfo } from '../temple-content.model';

@Component({
  selector: 'app-visit-page',
  templateUrl: './visit-page.component.html',
  styleUrls: ['./visit-page.component.scss']
})
export class VisitPageComponent implements OnInit {
  visitInfo: VisitInfo = {
    address: '-',
    phone: '-',
    email: '-'
  };
  galleryImages: GalleryImage[] = [];
  readonly currentPicturesTab = 'current';
  readonly addPictureTab = 'add';
  selectedTab = this.currentPicturesTab;
  isSubmitting = false;
  successMessage = '';
  errorMessage = '';

  formData: { title: string; description: string } = {
    title: '',
    description: ''
  };
  selectedFile: File | null = null;
  previewImage: GalleryImage | null = null;

  constructor(
    private readonly contentService: TempleContentService,
    private readonly authService: AuthService
  ) {}

  ngOnInit(): void {
    this.contentService.getVisitInfo().subscribe((data: VisitInfo) => {
      this.visitInfo = data;
    });

    this.loadGalleryImages();
  }

  get isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  get adminTabs(): string[] {
    return [this.currentPicturesTab, this.addPictureTab];
  }

  getTabLabel(tab: string): string {
    return tab === this.addPictureTab ? 'ചിത്രം ചേർക്കുക' : 'നിലവിലെ ചിത്രങ്ങൾ';
  }

  selectTab(tab: string): void {
    this.selectedTab = tab;
    this.successMessage = '';
    this.errorMessage = '';
  }

  isTabSelected(tab: string): boolean {
    return this.selectedTab === tab;
  }

  submit(): void {
    if (!this.selectedFile) {
      this.errorMessage = 'ദയവായി ഒരു ചിത്രം തിരഞ്ഞെടുക്കുക.';
      return;
    }

    this.successMessage = '';
    this.errorMessage = '';
    this.isSubmitting = true;

    this.contentService.uploadGalleryImage(this.formData.title, this.formData.description, this.selectedFile).subscribe({
      next: () => {
        this.successMessage = 'ചിത്രം വിജയകരമായി ചേർത്തു.';
        this.formData = {
          title: '',
          description: ''
        };
        this.selectedFile = null;
        this.isSubmitting = false;
        this.selectedTab = this.currentPicturesTab;
        this.loadGalleryImages();
      },
      error: (error) => {
        this.errorMessage = error?.error?.message ?? 'ചിത്രം ചേർക്കാനായില്ല. വീണ്ടും ശ്രമിക്കുക.';
        this.isSubmitting = false;
      }
    });
  }

  onFileSelected(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.selectedFile = inputElement.files && inputElement.files.length > 0
      ? inputElement.files[0]
      : null;
  }

  openPreview(image: GalleryImage): void {
    this.previewImage = image;
  }

  closePreview(): void {
    this.previewImage = null;
  }

  @HostListener('document:keydown.escape')
  onEscapePressed(): void {
    if (this.previewImage) {
      this.closePreview();
    }
  }

  private loadGalleryImages(): void {
    this.contentService.getGalleryImages().subscribe((images: GalleryImage[]) => {
      this.galleryImages = images;
    });
  }
}