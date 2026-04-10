import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { TempleContentService } from '../temple-content.service';
import { UpcomingPoojaBooking } from '../temple-content.model';

@Component({
  selector: 'app-schedule-page',
  templateUrl: './schedule-page.component.html',
  styleUrls: ['./schedule-page.component.scss']
})
export class SchedulePageComponent implements OnInit {
  readonly allCategory = 'എല്ലാം';
  readonly advanceNoticeCategory = 'മുൻകൂട്ടി അറിയിക്കേണ്ടവ';
  selectedCategory = this.allCategory;
  selectedTab: 'view' | 'add-pooja' | 'upcoming-bookings' = 'view';
  upcomingBookings: UpcomingPoojaBooking[] = [];
  bookingsLoading = false;
  bookingsError = '';
  
  newPooja = {
    title: '',
    price: '',
    category: this.allCategory,
    description: ''
  };

  constructor(
    public authService: AuthService,
    private readonly contentService: TempleContentService
  ) {}

  ngOnInit(): void {
    this.loadUpcomingBookings();
  }

  private loadUpcomingBookings(): void {
    this.bookingsLoading = true;
    this.bookingsError = '';
    this.contentService.getUpcomingPoojaBookings().subscribe({
      next: (bookings) => {
        this.upcomingBookings = bookings;
        this.bookingsLoading = false;
      },
      error: (error) => {
        this.bookingsError = 'നോക്കിഎസ് ലോഡ് ചെയ്യാൻ കഴിഞ്ഞില്ല. വീണ്ടും ശ്രമിക്കുക.';
        this.bookingsLoading = false;
        console.error('Error loading bookings:', error);
      }
    });
  }

  morningDarshanTime = '05:00 AM - 12:00 PM';
  eveningDarshanTime = '05:00 PM - 08:00 PM';

  schedule = [
    { time: '-', title: 'പുഷ്പാഞ്ജലി', description: '', price: '₹ 10.00', category: 'എല്ലാം' },
    { time: '-', title: 'കദളിപ്പഴം നിവേദ്യം', description: '', price: '₹ 20.00', category: 'എല്ലാം' },
    { time: '-', title: 'ഭാഗ്യസൂക്തം പുഷ്പാഞ്ജലി', description: '', price: '₹ 25.00', category: 'എല്ലാം' },
    { time: '-', title: 'വെള്ളനിവേദ്യം', description: '', price: '₹ 20.00', category: 'എല്ലാം' },
    { time: '-', title: 'പുരുഷസൂക്തം പുഷ്പാഞ്ജലി', description: '', price: '₹ 25.00', category: 'എല്ലാം' },
    { time: '-', title: 'ഒറ്റപ്പം (ഗണപതിക്ക്)', description: '', price: '₹ 70.00', category: 'എല്ലാം' },
    { time: '-', title: 'ശത്രുനിവാരണം പുഷ്പാഞ്ജലി', description: '', price: '₹ 25.00', category: 'എല്ലാം' },
    { time: '-', title: 'ബ്രഹ്മരക്ഷസ്സ് പൂജ', description: '', price: '₹ 150.00', category: 'എല്ലാം' },
    { time: '-', title: 'സ്വയംവരം പുഷ്പാഞ്ജലി', description: '', price: '₹ 25.00', category: 'എല്ലാം' },
    { time: '-', title: 'നിറമാല (ചെറുത്)', description: '', price: '₹ 300.00', category: 'എല്ലാം' },
    { time: '-', title: 'സാരസ്വതമന്ത്രം പുഷ്പാഞ്ജലി', description: '', price: '₹ 25.00', category: 'എല്ലാം' },
    { time: '-', title: 'നിറമാല (വലുത്)', description: '', price: '₹ 500.00', category: 'എല്ലാം' },
    { time: '-', title: 'സന്താനഗോപാലം പുഷ്പാഞ്ജലി', description: '', price: '₹ 25.00', category: 'എല്ലാം' },
    { time: '-', title: 'പാൽവെണ്ണ', description: '', price: '₹ 50.00', category: 'എല്ലാം' },
    { time: '-', title: 'ആയുസൂക്തം പുഷ്പാഞ്ജലി', description: '', price: '₹ 25.00', category: 'എല്ലാം' },
    { time: '-', title: 'പാലഭിഷേകം', description: '', price: '₹ 50.00', category: 'എല്ലാം' },
    { time: '-', title: 'ധന്വന്തരീമന്ത്രം പുഷ്പാഞ്ജലി', description: '', price: '₹ 25.00', category: 'എല്ലാം' },
    { time: '-', title: 'കറുകഹോമം', description: '', price: '₹ 50.00', category: 'എല്ലാം' },
    { time: '-', title: 'വിദ്യാഗോപാലമന്ത്രം പുഷ്പാഞ്ജലി', description: '', price: '₹ 25.00', category: 'എല്ലാം' },
    { time: '-', title: 'ഭഗവത്സേവ', description: '', price: '₹ 100.00', category: 'എല്ലാം' },
    { time: '-', title: 'ഐകമത്വം പുഷ്പാഞ്ജലി', description: '', price: '₹ 30.00', category: 'എല്ലാം' },
    { time: '-', title: 'വിഷ്ണുസഹസ്രനാമം പുഷ്പാഞ്ജലി', description: '', price: '₹ 100.00', category: 'എല്ലാം' },
    { time: '-', title: 'വിവാഹം', description: '', price: '₹ 500.00', category: 'എല്ലാം' },
    { time: '-', title: 'വിളക്ക്', description: '', price: '₹ 10.00', category: 'എല്ലാം' },
    { time: '-', title: 'സരസ്വതി പൂജ', description: '', price: '₹ 50.00', category: 'എല്ലാം' },
    { time: '-', title: 'മാല', description: '', price: '₹ 10.00', category: 'എല്ലാം' },
    { time: '-', title: 'വിദ്യാരംഭം', description: '', price: '₹ 50.00', category: 'എല്ലാം' },
    { time: '-', title: 'കറുകമാല', description: '', price: '₹ 10.00', category: 'എല്ലാം' },
    { time: '-', title: 'തുലാഭാരം', description: '', price: '₹ 50.00', category: 'എല്ലാം' },
    { time: '-', title: 'നെയ് വിളക്ക്', description: '', price: '₹ 20.00', category: 'എല്ലാം' },
    { time: '-', title: 'വാഹനപൂജ', description: '', price: '₹ 100.00', category: 'എല്ലാം' },
    { time: '-', title: 'നെൽപറ', description: '', price: '₹ 150.00', category: 'മുൻകൂട്ടി അറിയിക്കേണ്ടവ' },
    { time: '-', title: 'കെട്ടുനിറ', description: '', price: '₹ 20.00', category: 'മുൻകൂട്ടി അറിയിക്കേണ്ടവ' },
    { time: '-', title: 'നിത്യപൂജ', description: '', price: '₹ 100.00', category: 'മുൻകൂട്ടി അറിയിക്കേണ്ടവ' },
    { time: '-', title: 'നവഗ്രഹപൂജ', description: '', price: '₹ 500.00', category: 'മുൻകൂട്ടി അറിയിക്കേണ്ടവ' },
    { time: '-', title: 'ത്രികാലപൂജ', description: '', price: '₹ 300.00', category: 'മുൻകൂട്ടി അറിയിക്കേണ്ടവ' },
    { time: '-', title: 'ഗണപതിഹോമം', description: '', price: '₹ 50.00', category: 'മുൻകൂട്ടി അറിയിക്കേണ്ടവ' },
    { time: '-', title: 'ലക്ഷ്മീനാരായണ പൂജ (ചെറുത്)', description: '', price: '₹ 100.00', category: 'മുൻകൂട്ടി അറിയിക്കേണ്ടവ' },
    { time: '-', title: 'പാൽപായസം', description: '', price: '₹ 50.00', category: 'മുൻകൂട്ടി അറിയിക്കേണ്ടവ' },
    { time: '-', title: 'ലക്ഷ്മീനാരായണ പൂജ (വലുത്)', description: '', price: '₹ 300.00', category: 'മുൻകൂട്ടി അറിയിക്കേണ്ടവ' },
    { time: '-', title: 'ശർക്കരപായസം', description: '', price: '₹ 40.00', category: 'മുൻകൂട്ടി അറിയിക്കേണ്ടവ' },
    { time: '-', title: 'സുദർശനഹോമം', description: '', price: '₹ 350.00', category: 'മുൻകൂട്ടി അറിയിക്കേണ്ടവ' },
    { time: '-', title: 'ശംഖാഭിഷേകം', description: '', price: '₹ 10.00', category: 'മുൻകൂട്ടി അറിയിക്കേണ്ടവ' },
    { time: '-', title: 'ചുറ്റുവിളക്ക്', description: '', price: '₹ 2500.00', category: 'മുൻകൂട്ടി അറിയിക്കേണ്ടവ' },
    { time: '-', title: 'മലർനിവേദ്യം', description: '', price: '₹ 15.00', category: 'മുൻകൂട്ടി അറിയിക്കേണ്ടവ' },
    { time: '-', title: 'മുഴുക്കാപ്പ്', description: '', price: '₹ 2500.00', category: 'മുൻകൂട്ടി അറിയിക്കേണ്ടവ' },
    { time: '-', title: 'അവിൽനിവേദ്യം', description: '', price: '₹ 20.00', category: 'മുൻകൂട്ടി അറിയിക്കേണ്ടവ' },
    { time: '-', title: 'പാൽപായസം (ഒരു കുടം പാൽ)', description: '', price: '₹ 1800.00', category: 'മുൻകൂട്ടി അറിയിക്കേണ്ടവ' },
    { time: '-', title: 'തൃമധുരം', description: '', price: '₹ 30.00', category: 'മുൻകൂട്ടി അറിയിക്കേണ്ടവ' },
    { time: '-', title: 'പന്തീരാഴി (പാൽ)', description: '', price: '₹ 4500.00', category: 'മുൻകൂട്ടി അറിയിക്കേണ്ടവ' },
    { time: '-', title: 'കെടാവിളക്ക്', description: '', price: '₹ 100.00', category: 'മുൻകൂട്ടി അറിയിക്കേണ്ടവ' },
    { time: '-', title: 'ഉദയാസ്തമന പൂജ', description: '', price: '₹ 20000.00', category: 'മുൻകൂട്ടി അറിയിക്കേണ്ടവ' },
    { time: '-', title: 'വെണ്ണനിവേദ്യം', description: '', price: '₹ 20.00', category: 'മുൻകൂട്ടി അറിയിക്കേണ്ടവ' }
  ];

  get categoryOptions(): string[] {
    const categories = this.schedule
      .map((item) => item.category)
      .filter((c) => !!c && c !== this.allCategory);
    return [this.allCategory, ...Array.from(new Set(categories))];
  }

  selectCategory(category: string): void {
    this.selectedCategory = category;
  }

  isCategorySelected(category: string): boolean {
    return this.selectedCategory === category;
  }

  get filteredSchedule() {
    return this.schedule.filter(
      (item) => this.selectedCategory === this.allCategory || item.category === this.selectedCategory
    );
  }

  addNewPooja(): void {
    if (!this.newPooja.title || !this.newPooja.price) {
      alert('പ്ലീസ് എല്ലാ ഫീല്ഡുകളും പൂരിപ്പിക്കുക');
      return;
    }

    const pooja = {
      time: '-',
      title: this.newPooja.title,
      description: this.newPooja.description,
      price: this.newPooja.price.startsWith('₹') ? this.newPooja.price : `₹ ${this.newPooja.price}`,
      category: this.newPooja.category
    };

    this.schedule.push(pooja);
    this.resetForm();
    this.selectedTab = 'view';
  }

  resetForm(): void {
    this.newPooja = {
      title: '',
      price: '',
      category: this.allCategory,
      description: ''
    };
  }
}