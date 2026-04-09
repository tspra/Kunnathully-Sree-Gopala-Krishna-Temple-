import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { HomeNotice, ScheduleItem, UpcomingPoojaBooking } from '../temple-content.model';
import { TempleContentService } from '../temple-content.service';

@Component({
  selector: 'app-schedule-page',
  templateUrl: './schedule-page.component.html',
  styleUrls: ['./schedule-page.component.scss']
})
export class SchedulePageComponent implements OnInit {
  schedule: ScheduleItem[] = [];
  newPoojaTypeName = '';
  newPoojaTypePrice = '';
  newPoojaTypeCategory = '';
  addPoojaMessage = '';
  addPoojaMessageType: 'success' | 'error' = 'success';
  isAddingPoojaType = false;
  homeNotice: HomeNotice = {
    label: '',
    title: '',
    description: '',
    darshanHeading: '',
    morningDarshanTime: '05:00 AM - 12:00 PM',
    eveningDarshanTime: '05:00 PM - 08:00 PM'
  };
  isLoadingUpcoming = false;
  upcomingErrorMessage = '';
  upcomingBookings: UpcomingPoojaBooking[] = [];
  readonly poojaTab = 'pooja';
  readonly addPoojaTab = 'add-pooja';
  readonly upcomingTab = 'upcoming';
  selectedTab = this.poojaTab;
  readonly allCategory = 'എല്ലാം';
  readonly advanceNoticeCategory = 'മുൻകൂട്ടി അറിയിക്കേണ്ടവ';
  selectedCategory = this.allCategory;

  constructor(
    private readonly contentService: TempleContentService,
    private readonly authService: AuthService
  ) {}

  ngOnInit(): void {
    this.contentService.getSchedule().subscribe((items: ScheduleItem[]) => {
      this.schedule = items;
    });

    this.contentService.getHomeNotice().subscribe({
      next: (notice: HomeNotice) => {
        this.homeNotice = notice;
      }
    });

    if (this.isAdmin) {
      this.loadUpcomingBookings();
    }
  }

  get isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  get adminTabs(): string[] {
    return [this.poojaTab, this.addPoojaTab, this.upcomingTab];
  }

  get categoryOptions(): string[] {
    const categories = this.schedule
      .map((item) => item.category)
      .filter((category) => !!category && category !== this.allCategory);

    return [this.allCategory, ...Array.from(new Set(categories))];
  }

  selectTab(tab: string): void {
    this.selectedTab = tab;
  }

  isTabSelected(tab: string): boolean {
    return this.selectedTab === tab;
  }

  getTabLabel(tab: string): string {
    if (tab === this.upcomingTab) {
      return 'വരാനിരിക്കുന്ന ബുക്കിംഗുകൾ';
    }

    if (tab === this.addPoojaTab) {
      return 'പുതിയ പൂജാ തരം ചേർക്കുക';
    }

    return 'പൂജ';
  }

  selectCategory(category: string): void {
    this.selectedCategory = category;
  }

  isCategorySelected(category: string): boolean {
    return this.selectedCategory === category;
  }

  get filteredSchedule(): ScheduleItem[] {
    return this.schedule
      .filter((item) => this.selectedCategory === this.allCategory || item.category === this.selectedCategory);
  }

  addPoojaType(): void {
    const trimmedTitle = this.newPoojaTypeName.trim();
    const trimmedPrice = this.newPoojaTypePrice.trim();
    const trimmedCategory = this.newPoojaTypeCategory.trim();

    if (trimmedTitle.length < 2) {
      this.addPoojaMessageType = 'error';
      this.addPoojaMessage = 'പൂജാ തരം കുറഞ്ഞത് 2 അക്ഷരം വേണം.';
      return;
    }

    if (!trimmedPrice) {
      this.addPoojaMessageType = 'error';
      this.addPoojaMessage = 'വില നൽകുക.';
      return;
    }

    const newItem: ScheduleItem = {
      time: '-',
      title: trimmedTitle,
      description: '',
      price: trimmedPrice,
      category: trimmedCategory || this.allCategory
    };

    this.isAddingPoojaType = true;
    this.addPoojaMessage = '';

    this.contentService.updateSchedule([...this.schedule, newItem]).subscribe({
      next: (updatedItems) => {
        this.schedule = updatedItems;
        this.newPoojaTypeName = '';
        this.newPoojaTypePrice = '';
        this.newPoojaTypeCategory = '';
        this.addPoojaMessageType = 'success';
        this.addPoojaMessage = 'പുതിയ പൂജാ തരം വിജയകരമായി ചേർത്തു.';
        this.isAddingPoojaType = false;
      },
      error: () => {
        this.addPoojaMessageType = 'error';
        this.addPoojaMessage = 'പൂജാ തരം ചേർക്കാൻ കഴിഞ്ഞില്ല. വീണ്ടും ശ്രമിക്കുക.';
        this.isAddingPoojaType = false;
      }
    });
  }

  private loadUpcomingBookings(): void {
    this.upcomingErrorMessage = '';
    this.isLoadingUpcoming = true;

    this.contentService.getUpcomingPoojaBookings().subscribe({
      next: (bookings) => {
        this.upcomingBookings = bookings;
        this.isLoadingUpcoming = false;
      },
      error: () => {
        this.upcomingBookings = [];
        this.upcomingErrorMessage = 'ബുക്കിംഗുകൾ ലോഡ് ചെയ്യാനായില്ല. വീണ്ടും ശ്രമിക്കുക.';
        this.isLoadingUpcoming = false;
      }
    });
  }

}