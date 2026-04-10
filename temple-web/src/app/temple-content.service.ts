import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, forkJoin, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { CreateDonationPlanRequest, DonateInfo, UpdateDonateInfoRequest, UpdateVisitInfoRequest, ChangePasswordRequest, CreateEventRequest, DonationPlan, GalleryImage, LoginRequest, LoginResponse, PoojaBookingRequest, PoojaBookingResponse, RegisterAccountRequest, RegisterAccountResponse, TempleContent, TempleEvent, UpcomingPoojaBooking, VisitInfo } from './temple-content.model';
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

  private normalizeImageUrl(imageUrl: string | undefined): string {
    if (!imageUrl) {
      return '';
    }

    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://') || imageUrl.startsWith('data:') || imageUrl.startsWith('assets/')) {
      return imageUrl;
    }

    if (imageUrl.startsWith('/')) {
      return this.apiBaseUrl ? `${this.apiBaseUrl}${imageUrl}` : imageUrl;
    }

    if (imageUrl.startsWith('api/')) {
      return this.apiBaseUrl ? `${this.apiBaseUrl}/${imageUrl}` : `/${imageUrl}`;
    }

    return imageUrl;
  }

  getContent(): Observable<TempleContent> {
    const events$ = this.getEvents().pipe(catchError(() => of([] as TempleEvent[])));
    const donationPlans$ = this.getDonationPlans().pipe(catchError(() => of([] as DonationPlan[])));
    const gallery$ = this.getGalleryImages().pipe(catchError(() => of([] as GalleryImage[])));
    const visit$ = this.getVisitInfo().pipe(
      catchError(() =>
        of({
          address: '',
          phone: '',
          email: ''
        } as VisitInfo))
    );

    return forkJoin({
      events: events$,
      donationPlans: donationPlans$,
      gallery: gallery$,
      visit: visit$
    }).pipe(
      map(({ events, donationPlans, gallery, visit }) => ({
        hero: {
          eyebrow: 'ക്ഷേത്ര അറിയിപ്പ്',
          title: 'കുന്നത്തുള്ളി ശ്രീ ഗോപാലകൃഷ്ണ ക്ഷേത്രം',
          subtitle: 'ആത്മീയ സമാധാനവും സമൂഹ ഐക്യവും വളർത്തുന്ന വിശുദ്ധ സ്ഥാനം',
          primaryAction: 'Plan Your Visit',
          secondaryAction: 'Support A Seva'
        },
        stats: [
          { label: 'തിങ്കൾ മുതൽ ഞായർ വരെ', value: '05:00 AM - 12:00 PM | 05:00 PM - 08:00 PM' },
          { label: 'Upcoming Events', value: `${events.length}` }
        ],
        schedule: [],
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

  getEvents(): Observable<TempleEvent[]> {
    return this.http.get<TempleEvent[]>(this.apiUrl('/api/content/events')).pipe(
      map((events) =>
        events.map((event) => ({
          ...event,
          imageUrl: this.normalizeImageUrl(event.imageUrl)
        }))
      )
    );
  }

  createEvent(payload: CreateEventRequest): Observable<TempleEvent> {
    return this.http.post<TempleEvent>(this.apiUrl('/api/content/events'), payload).pipe(
      map((event) => ({
        ...event,
        imageUrl: this.normalizeImageUrl(event.imageUrl)
      }))
    );
  }

  uploadEventImage(file: File): Observable<{ imageUrl: string }> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<{ imageUrl: string }>(this.apiUrl('/api/content/events/upload-image'), formData).pipe(
      map((result) => ({ imageUrl: this.normalizeImageUrl(result.imageUrl) }))
    );
  }

  deletePastEvent(eventId: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(this.apiUrl(`/api/content/events/${eventId}`));
  }

  getDonationPlans(): Observable<DonationPlan[]> {
    return this.http.get<DonationPlan[]>(this.apiUrl('/api/content/donate')).pipe(
      map((plans) =>
        plans.map((plan) => ({
          ...plan,
          imageUrl: this.normalizeImageUrl(plan.imageUrl)
        }))
      )
    );
  }

  createDonationPlan(payload: CreateDonationPlanRequest): Observable<DonationPlan> {
    return this.http.post<DonationPlan>(this.apiUrl('/api/content/donate'), payload).pipe(
      map((plan) => ({
        ...plan,
        imageUrl: this.normalizeImageUrl(plan.imageUrl)
      }))
    );
  }

  deleteDonationPlan(donationId: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(this.apiUrl(`/api/content/donate/${donationId}`));
  }

  uploadDonationPlanImage(file: File): Observable<{ imageUrl: string }> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<{ imageUrl: string }>(this.apiUrl('/api/content/donate/upload-image'), formData).pipe(
      map((result) => ({ imageUrl: this.normalizeImageUrl(result.imageUrl) }))
    );
  }

  getDonateInfo(): Observable<DonateInfo> {
    return this.http.get<DonateInfo>(this.apiUrl('/api/content/donate-info')).pipe(
      map((info) => ({
        ...info,
        upiImageUrl: this.normalizeImageUrl(info.upiImageUrl)
      }))
    );
  }

  updateDonateInfo(payload: UpdateDonateInfoRequest): Observable<DonateInfo> {
    return this.http.put<DonateInfo>(this.apiUrl('/api/content/donate-info'), payload).pipe(
      map((info) => ({
        ...info,
        upiImageUrl: this.normalizeImageUrl(info.upiImageUrl)
      }))
    );
  }

  uploadDonateUpiImage(file: File): Observable<DonateInfo> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<DonateInfo>(this.apiUrl('/api/content/donate-info/upload-upi'), formData).pipe(
      map((info) => ({
        ...info,
        upiImageUrl: this.normalizeImageUrl(info.upiImageUrl)
      }))
    );
  }

  getVisitInfo(): Observable<VisitInfo> {
    return this.http.get<VisitInfo>(this.apiUrl('/api/content/visit'));
  }

  updateVisitInfo(payload: UpdateVisitInfoRequest): Observable<VisitInfo> {
    console.log('Service: Sending PUT request to /api/content/visit with payload:', payload);
    return this.http.put<VisitInfo>(this.apiUrl('/api/content/visit'), payload);
  }

  getGalleryImages(): Observable<GalleryImage[]> {
    return this.http.get<GalleryImage[]>(this.apiUrl('/api/content/gallery')).pipe(
      map((images) =>
        images.map((image) => ({
          ...image,
          imageUrl: this.normalizeImageUrl(image.imageUrl)
        }))
      )
    );
  }

  uploadGalleryImage(title: string, description: string, file: File): Observable<GalleryImage> {
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('file', file);
    return this.http.post<GalleryImage>(this.apiUrl('/api/content/gallery/upload'), formData).pipe(
      map((image) => ({
        ...image,
        imageUrl: this.normalizeImageUrl(image.imageUrl)
      }))
    );
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