import { Component, HostListener, OnInit } from '@angular/core';
import { TempleContent, VisitInfo } from './temple-content.model';
import { TempleContentService } from './temple-content.service';
import { AuthService } from './auth.service';

const fallbackContent: TempleContent = {
  hero: {
    eyebrow: 'Sacred heritage, modern hospitality',
    title: 'A professional website template for a welcoming temple community.',
    subtitle: 'Present your temple\'s daily worship, special events, seva opportunities, and visitor information in a clear and respectful format.',
    primaryAction: 'Plan Your Visit',
    secondaryAction: 'Support A Seva'
  },
  stats: [
    { label: 'Daily Darshan', value: '5:30 AM - 8:30 PM' },
    { label: 'Weekly Programs', value: '12 guided gatherings' },
    { label: 'Community Families', value: '1,500+ devotees' }
  ],
  schedule: [
    { time: '5:30 AM', title: 'Suprabhatam and Temple Opening', description: 'Morning chants and first darshan for early visitors.', price: '₹ 30.00', category: 'എല്ലാം' },
    { time: '12:00 PM', title: 'Madhyahna Aarti', description: 'Midday offering with priest blessings and prasadam.', price: '₹ 40.00', category: 'എല്ലാം' },
    { time: '6:30 PM', title: 'Sandhya Deepa Aarti', description: 'Evening lamps, bhajans, and community prayer.', price: '₹ 50.00', category: 'എല്ലാം' },
    { time: '8:15 PM', title: 'Shayana Seva', description: 'Closing prayers before temple doors are respectfully closed.', price: '₹ 60.00', category: 'എല്ലാം' }
  ],
  offerings: [
    { title: 'Archana and Sankalpam', description: 'Highlight personalized puja requests with booking guidance for families and sponsors.', accent: 'saffron' },
    { title: 'Festivals and Utsavams', description: 'Promote annual celebrations, procession details, and volunteer coordination from one place.', accent: 'marigold' },
    { title: 'Spiritual Education', description: 'Showcase scripture classes, youth programs, and cultural learning with a polished presentation.', accent: 'leaf' },
    { title: 'Annadanam and Community Care', description: 'Feature food service initiatives, charitable outreach, and donation campaigns.', accent: 'stone' }
  ],
  events: [
    { title: 'Sri Rama Navami Mahotsavam', date: 'April 17, 2026', description: 'Special homam, devotional music, and prasadam service throughout the day.' },
    { title: 'Monthly Satyanarayana Puja', date: 'April 20, 2026', description: 'Family registration, sankalpam slots, and evening aarti in the main hall.' },
    { title: 'Youth Heritage Workshop', date: 'April 27, 2026', description: 'Interactive classes on shlokas, values, and temple traditions for students.' }
  ],
  gallery: [
    { title: 'Sanctum and Alankaram', description: 'Use this area to showcase deity decoration, floral arrangements, and festive temple decor.' },
    { title: 'Volunteer Moments', description: 'Present moments from annadanam, seva teams, and community-led support programs.' },
    { title: 'Festival Processions', description: 'Display major celebrations with dignified visuals and concise context for visitors.' }
  ],
  donationPlans: [
    { title: 'Daily Seva', description: 'Ideal for sponsoring lamps, flowers, or one-day prasadam distribution.' },
    { title: 'Festival Sponsor', description: 'Support decorations, music, and hospitality for major temple observances.' },
    { title: 'Community Care Fund', description: 'Contribute toward education, food service, and outreach activity across the year.' }
  ],
  contact: {
    address: '125 Lotus Avenue, Heritage Square, Your City',
    phone: '+1 (555) 108-1088',
    email: 'info@srianandamandir.org',
    visitingHours: 'Open daily from 5:30 AM to 8:30 PM'
  }
};

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'കുന്നത്തുള്ളി ശ്രീ ഗോപാലകൃഷ്ണ ക്ഷേത്രം';
  content = fallbackContent;
  currentYear = new Date().getFullYear();
  isLoading = true;
  loadError = false;
  menuOpen = false;
  visitInfo: VisitInfo = {
    address: '',
    phone: '',
    email: '',
    visitingHours: ''
  };

  constructor(
    private readonly templeContentService: TempleContentService,
    private readonly authService: AuthService
  ) {}

  ngOnInit(): void {
    this.templeContentService.getContent().subscribe({
      next: (content) => {
        this.content = content;
        this.isLoading = false;
      },
      error: () => {
        this.loadError = true;
        this.isLoading = false;
      }
    });

    this.templeContentService.getVisitInfo().subscribe({
      next: (visitInfo) => {
        this.visitInfo = visitInfo;
      }
    });
  }

  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.user-menu')) {
      this.menuOpen = false;
    }
  }

  logout(): void {
    this.menuOpen = false;
    this.authService.logout();
  }
}
