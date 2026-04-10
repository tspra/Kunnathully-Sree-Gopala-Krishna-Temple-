import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { CreateEventRequest, TempleEvent } from '../temple-content.model';
import { TempleContentService } from '../temple-content.service';

@Component({
  selector: 'app-events-page',
  templateUrl: './events-page.component.html',
  styleUrls: ['./events-page.component.scss']
})
export class EventsPageComponent implements OnInit {
  events: TempleEvent[] = [];
  readonly defaultEventImageUrl = 'assets/images/Image1.PNG';
  readonly currentEventsTab = 'current';
  readonly addEventTab = 'add';
  selectedTab = this.currentEventsTab;
  isSubmitting = false;
  deletingEventId: number | null = null;
  successMessage = '';
  errorMessage = '';
  selectedEventImageFile: File | null = null;
  eventImagePreviewUrl = this.defaultEventImageUrl;

  formData: CreateEventRequest = {
    title: '',
    date: '',
    description: '',
    imageUrl: this.defaultEventImageUrl
  };

  constructor(
    private readonly contentService: TempleContentService,
    private readonly authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadEvents();
  }

  get isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  get adminTabs(): string[] {
    return [this.currentEventsTab, this.addEventTab];
  }

  getTabLabel(tab: string): string {
    return tab === this.addEventTab ? 'പുതിയ ഇവന്റ് ചേർക്കുക' : 'നിലവിലെ ഇവന്റുകൾ';
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
    if (!this.formData.title || !this.formData.date) {
      this.errorMessage = 'ഇവന്റിന്റെ പേരും തീയതിയും നിർബന്ധമാണ്.';
      return;
    }

    this.successMessage = '';
    this.errorMessage = '';
    this.isSubmitting = true;

    const createEvent = (imageUrl: string) => {
      this.contentService.createEvent({
        ...this.formData,
        imageUrl
      }).subscribe({
        next: () => {
          this.successMessage = 'ഇവന്റ് വിജയകരമായി ചേർത്തു.';
          this.formData = {
            title: '',
            date: '',
            description: '',
            imageUrl: this.defaultEventImageUrl
          };
          this.selectedEventImageFile = null;
          this.eventImagePreviewUrl = this.defaultEventImageUrl;
          this.isSubmitting = false;
          this.selectedTab = this.currentEventsTab;
          this.loadEvents();
        },
        error: (error) => {
          this.errorMessage = error?.error?.message ?? 'ഇവന്റ് ചേർക്കാനായില്ല. വീണ്ടും ശ്രമിക്കുക.';
          this.isSubmitting = false;
        }
      });
    };

    if (this.selectedEventImageFile) {
      this.contentService.uploadEventImage(this.selectedEventImageFile).subscribe({
        next: (uploadResult) => createEvent(uploadResult.imageUrl),
        error: (error) => {
          this.errorMessage = error?.error?.message ?? 'ചിത്രം അപ്‌ലോഡ് ചെയ്യാനായില്ല. വീണ്ടും ശ്രമിക്കുക.';
          this.isSubmitting = false;
        }
      });
      return;
    }

    createEvent(this.formData.imageUrl || this.defaultEventImageUrl);
  }

  onEventImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const files = input.files;
    this.selectedEventImageFile = files && files.length > 0 ? files[0] : null;

    if (!this.selectedEventImageFile) {
      this.eventImagePreviewUrl = this.defaultEventImageUrl;
      return;
    }

    this.eventImagePreviewUrl = URL.createObjectURL(this.selectedEventImageFile);
  }

  isPastEvent(event: TempleEvent): boolean {
    const eventDate = this.parseDate(event.date);
    if (!eventDate) {
      return false;
    }

    const today = new Date();
    const todayOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    return eventDate < todayOnly;
  }

  deletePastEvent(event: TempleEvent): void {
    if (!event.id || this.deletingEventId !== null || !this.isPastEvent(event)) {
      return;
    }


    this.successMessage = '';
    this.errorMessage = '';
    this.deletingEventId = event.id;

    this.contentService.deletePastEvent(event.id).subscribe({
      next: (result) => {
        this.successMessage = result.message ?? 'പഴയ ഇവന്റ് നീക്കം ചെയ്തു.';
        this.errorMessage = '';
        this.deletingEventId = null;
        this.loadEvents();
      },
      error: (error) => {
        this.errorMessage = error?.error?.message ?? 'ഇവന്റ് നീക്കം ചെയ്യാനായില്ല. വീണ്ടും ശ്രമിക്കുക.';
        this.successMessage = '';
        this.deletingEventId = null;
      }
    });
  }

  private loadEvents(): void {
    this.contentService.getEvents().subscribe((items: TempleEvent[]) => {
      this.events = items;
    });
  }

  private parseDate(value: string): Date | null {
    const exactDate = /^\d{4}-\d{2}-\d{2}$/.exec(value);
    if (exactDate) {
      const [year, month, day] = value.split('-').map(Number);
      return new Date(year, month - 1, day);
    }

    const monthDate = /^([^\d,]+)\s+(\d{1,2}),\s*(\d{4})$/.exec(value.trim());
    if (monthDate) {
      const monthName = monthDate[1].trim().toLowerCase();
      const day = Number(monthDate[2]);
      const year = Number(monthDate[3]);
      const monthLookup: Record<string, number> = {
        january: 0,
        february: 1,
        march: 2,
        april: 3,
        may: 4,
        june: 5,
        july: 6,
        august: 7,
        september: 8,
        october: 9,
        november: 10,
        december: 11,
        'ജനുവരി': 0,
        'ഫെബ്രുവരി': 1,
        'മാർച്ച്': 2,
        'ഏപ്രിൽ': 3,
        'മെയ്': 4,
        'ജൂൺ': 5,
        'ജൂലൈ': 6,
        'ഓഗസ്റ്റ്': 7,
        'സെപ്റ്റംബർ': 8,
        'ഒക്ടോബർ': 9,
        'നവംബർ': 10,
        'ഡിസംബർ': 11
      };

      const monthIndex = monthLookup[monthName];
      if (monthIndex !== undefined) {
        return new Date(year, monthIndex, day);
      }
    }

    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? null : new Date(parsed.getFullYear(), parsed.getMonth(), parsed.getDate());
  }
}