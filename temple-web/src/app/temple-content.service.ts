import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, forkJoin, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AboutPageContent, CreateDonationPlanRequest, DonateInfo, HomeNotice, UpdateAboutPageRequest, UpdateDonateInfoRequest, UpdateHomeNoticeRequest, UpdateVisitInfoRequest, ChangePasswordRequest, CreateEventRequest, CreateGalleryImageRequest, DonationPlan, GalleryImage, LoginRequest, LoginResponse, PoojaBookingRequest, PoojaBookingResponse, RegisterAccountRequest, RegisterAccountResponse, ScheduleItem, TempleContent, TempleEvent, UpcomingPoojaBooking, VisitInfo } from './temple-content.model';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TempleContentService {
  private readonly apiBaseUrl = environment.apiBaseUrl?.replace(/\/$/, '') ?? '';

  constructor(private readonly http: HttpClient) {}

  private apiUrl(path: string): string {
    return this.apiBaseUrl ? `${this.apiBaseUrl}${path}` : path;
  }

  getContent(): Observable<TempleContent> {
    const about$ = this.getAboutContent().pipe(
      catchError(() =>
        of({
          templeName: 'കുന്നത്തുള്ളി ശ്രീ ഗോപാലകൃഷ്ണ ക്ഷേത്രം',
          title: 'A sacred space serving devotion, culture, and community.',
          description: 'Our temple preserves timeless traditions while welcoming every family with dignity, transparency, and care.'
        } as AboutPageContent))
    );

    const notice$ = this.getHomeNotice().pipe(
      catchError(() =>
        of({
          label: 'ക്ഷേത്ര അറിയിപ്പ്',
          title: 'ഇന്നത്തെ പ്രധാന വിവരം',
          description: 'രാവിലെ 06:00 മുതൽ 09:00 വരെ ദർശനം ലഭ്യമാണ്. വൈകുന്നേരം 05:00 മുതൽ 08:00 വരെ വീണ്ടും ദർശനം ഉണ്ടായിരിക്കും.',
          darshanHeading: 'തിങ്കൾ മുതൽ ഞായർ വരെ',
          morningDarshanTime: '05:00 AM - 12:00 PM',
          eveningDarshanTime: '05:00 PM - 08:00 PM'
        } as HomeNotice))
    );

    const schedule$ = this.getSchedule().pipe(catchError(() => of([] as ScheduleItem[])));
    const events$ = this.getEvents().pipe(catchError(() => of([] as TempleEvent[])));
    const donationPlans$ = this.getDonationPlans().pipe(catchError(() => of([] as DonationPlan[])));
    const gallery$ = this.getGalleryImages().pipe(catchError(() => of([] as GalleryImage[])));
    const visit$ = this.getVisitInfo().pipe(
      catchError(() =>
        of({
          address: '',
          phone: '',
          email: '',
          visitingHours: ''
        } as VisitInfo))
    );

    return forkJoin({
      about: about$,
      notice: notice$,
      schedule: schedule$,
      events: events$,
      donationPlans: donationPlans$,
      gallery: gallery$,
      visit: visit$
    }).pipe(
      map(({ about, notice, schedule, events, donationPlans, gallery, visit }) => ({
        hero: {
          eyebrow: notice.label,
          title: about.templeName,
          subtitle: about.description,
          primaryAction: 'Plan Your Visit',
          secondaryAction: 'Support A Seva'
        },
        stats: [
          { label: notice.darshanHeading, value: `${notice.morningDarshanTime} | ${notice.eveningDarshanTime}` },
          { label: 'Seva Offerings', value: `${schedule.length}` },
          { label: 'Upcoming Events', value: `${events.length}` }
        ],
        schedule,
        offerings: [
          { title: 'Archana and Sankalpam', description: 'Personalized pooja requests with booking guidance for families and sponsors.', accent: 'saffron' },
          { title: 'Festivals and Utsavams', description: 'Annual celebrations, procession details, and volunteer coordination.', accent: 'marigold' },
          { title: 'Spiritual Education', description: 'Scripture classes, youth programs, and cultural learning.', accent: 'leaf' },
          { title: 'Annadanam and Community Care', description: 'Food service initiatives, charitable outreach, and donation campaigns.', accent: 'stone' }
        ],
        events,
        gallery: gallery.slice(0, 3).map((item) => ({
          title: item.title,
          description: item.description
        })),
        donationPlans,
        contact: visit
      }))
    );
  }

  getAboutContent(): Observable<AboutPageContent> {
    return this.http.get<AboutPageContent>(this.apiUrl('/api/content/about'));
  }

  getHomeNotice(): Observable<HomeNotice> {
    return this.http.get<HomeNotice>(this.apiUrl('/api/content/home-notice'));
  }

  updateAboutContent(payload: UpdateAboutPageRequest): Observable<AboutPageContent> {
    console.log('Service: Sending PUT request to /api/content/about with payload:', payload);
    return this.http.put<AboutPageContent>(this.apiUrl('/api/content/about'), payload);
  }

  updateHomeNotice(payload: UpdateHomeNoticeRequest): Observable<HomeNotice> {
    return this.http.put<HomeNotice>(this.apiUrl('/api/content/home-notice'), payload);
  }

  getSchedule(): Observable<ScheduleItem[]> {
    return this.http.get<ScheduleItem[]>(this.apiUrl('/api/content/schedule'));
  }

  updateSchedule(payload: ScheduleItem[]): Observable<ScheduleItem[]> {
    return this.http.put<ScheduleItem[]>(this.apiUrl('/api/content/schedule'), payload);
  }

  getEvents(): Observable<TempleEvent[]> {
    return this.http.get<TempleEvent[]>(this.apiUrl('/api/content/events'));
  }

  createEvent(payload: CreateEventRequest): Observable<TempleEvent> {
    return this.http.post<TempleEvent>(this.apiUrl('/api/content/events'), payload);
  }

  deletePastEvent(eventId: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(this.apiUrl(`/api/content/events/${eventId}`));
  }

  getDonationPlans(): Observable<DonationPlan[]> {
    return this.http.get<DonationPlan[]>(this.apiUrl('/api/content/donate'));
  }

  createDonationPlan(payload: CreateDonationPlanRequest): Observable<DonationPlan> {
    return this.http.post<DonationPlan>(this.apiUrl('/api/content/donate'), payload);
  }

  deleteDonationPlan(donationId: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(this.apiUrl(`/api/content/donate/${donationId}`));
  }

  uploadDonationPlanImage(file: File): Observable<{ imageUrl: string }> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<{ imageUrl: string }>(this.apiUrl('/api/content/donate/upload-image'), formData);
  }

  getDonateInfo(): Observable<DonateInfo> {
    return this.http.get<DonateInfo>(this.apiUrl('/api/content/donate-info'));
  }

  updateDonateInfo(payload: UpdateDonateInfoRequest): Observable<DonateInfo> {
    return this.http.put<DonateInfo>(this.apiUrl('/api/content/donate-info'), payload);
  }

  uploadDonateUpiImage(file: File): Observable<DonateInfo> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<DonateInfo>(this.apiUrl('/api/content/donate-info/upload-upi'), formData);
  }

  getVisitInfo(): Observable<VisitInfo> {
    return this.http.get<VisitInfo>(this.apiUrl('/api/content/visit'));
  }

  updateVisitInfo(payload: UpdateVisitInfoRequest): Observable<VisitInfo> {
    console.log('Service: Sending PUT request to /api/content/visit with payload:', payload);
    return this.http.put<VisitInfo>(this.apiUrl('/api/content/visit'), payload);
  }

  getGalleryImages(): Observable<GalleryImage[]> {
    return this.http.get<GalleryImage[]>(this.apiUrl('/api/content/gallery'));
  }

  createGalleryImage(payload: CreateGalleryImageRequest): Observable<GalleryImage> {
    return this.http.post<GalleryImage>(this.apiUrl('/api/content/gallery'), payload);
  }

  uploadGalleryImage(title: string, description: string, file: File): Observable<GalleryImage> {
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('file', file);
    return this.http.post<GalleryImage>(this.apiUrl('/api/content/gallery/upload'), formData);
  }

  registerAccount(payload: RegisterAccountRequest): Observable<RegisterAccountResponse> {
    return this.http.post<RegisterAccountResponse>(this.apiUrl('/api/accounts/register'), payload);
  }

  login(payload: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(this.apiUrl('/api/accounts/login'), payload);
  }

  createPoojaBooking(payload: PoojaBookingRequest): Observable<PoojaBookingResponse> {
    return this.http.post<PoojaBookingResponse>(this.apiUrl('/api/pooja-bookings'), payload);
  }

  getUpcomingPoojaBookings(): Observable<UpcomingPoojaBooking[]> {
    return this.http.get<UpcomingPoojaBooking[]>(this.apiUrl('/api/pooja-bookings/upcoming'));
  }

  changePassword(payload: ChangePasswordRequest): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(this.apiUrl('/api/accounts/change-password'), payload);
  }
}