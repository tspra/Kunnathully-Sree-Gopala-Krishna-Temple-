import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AboutPageContent, CreateDonationPlanRequest, DonateInfo, HomeNotice, UpdateAboutPageRequest, UpdateDonateInfoRequest, UpdateHomeNoticeRequest, UpdateVisitInfoRequest, ChangePasswordRequest, CreateEventRequest, CreateGalleryImageRequest, DonationPlan, GalleryImage, LoginRequest, LoginResponse, PoojaBookingRequest, PoojaBookingResponse, RegisterAccountRequest, RegisterAccountResponse, ScheduleItem, TempleContent, TempleEvent, UpcomingPoojaBooking, VisitInfo } from './temple-content.model';

@Injectable({
  providedIn: 'root'
})
export class TempleContentService {
  constructor(private readonly http: HttpClient) {}

  getContent(): Observable<TempleContent> {
    return this.http.get<TempleContent>('/api/temple-content');
  }

  getAboutContent(): Observable<AboutPageContent> {
    return this.http.get<AboutPageContent>('/api/content/about');
  }

  getHomeNotice(): Observable<HomeNotice> {
    return this.http.get<HomeNotice>('/api/content/home-notice');
  }

  updateAboutContent(payload: UpdateAboutPageRequest): Observable<AboutPageContent> {
    console.log('Service: Sending PUT request to /api/content/about with payload:', payload);
    return this.http.put<AboutPageContent>('/api/content/about', payload);
  }

  updateHomeNotice(payload: UpdateHomeNoticeRequest): Observable<HomeNotice> {
    return this.http.put<HomeNotice>('/api/content/home-notice', payload);
  }

  getSchedule(): Observable<ScheduleItem[]> {
    return this.http.get<ScheduleItem[]>('/api/content/schedule');
  }

  updateSchedule(payload: ScheduleItem[]): Observable<ScheduleItem[]> {
    return this.http.put<ScheduleItem[]>('/api/content/schedule', payload);
  }

  getEvents(): Observable<TempleEvent[]> {
    return this.http.get<TempleEvent[]>('/api/content/events');
  }

  createEvent(payload: CreateEventRequest): Observable<TempleEvent> {
    return this.http.post<TempleEvent>('/api/content/events', payload);
  }

  deletePastEvent(eventId: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`/api/content/events/${eventId}`);
  }

  getDonationPlans(): Observable<DonationPlan[]> {
    return this.http.get<DonationPlan[]>('/api/content/donate');
  }

  createDonationPlan(payload: CreateDonationPlanRequest): Observable<DonationPlan> {
    return this.http.post<DonationPlan>('/api/content/donate', payload);
  }

  deleteDonationPlan(donationId: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`/api/content/donate/${donationId}`);
  }

  uploadDonationPlanImage(file: File): Observable<{ imageUrl: string }> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<{ imageUrl: string }>('/api/content/donate/upload-image', formData);
  }

  getDonateInfo(): Observable<DonateInfo> {
    return this.http.get<DonateInfo>('/api/content/donate-info');
  }

  updateDonateInfo(payload: UpdateDonateInfoRequest): Observable<DonateInfo> {
    return this.http.put<DonateInfo>('/api/content/donate-info', payload);
  }

  uploadDonateUpiImage(file: File): Observable<DonateInfo> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<DonateInfo>('/api/content/donate-info/upload-upi', formData);
  }

  getVisitInfo(): Observable<VisitInfo> {
    return this.http.get<VisitInfo>('/api/content/visit');
  }

  updateVisitInfo(payload: UpdateVisitInfoRequest): Observable<VisitInfo> {
    console.log('Service: Sending PUT request to /api/content/visit with payload:', payload);
    return this.http.put<VisitInfo>('/api/content/visit', payload);
  }

  getGalleryImages(): Observable<GalleryImage[]> {
    return this.http.get<GalleryImage[]>('/api/content/gallery');
  }

  createGalleryImage(payload: CreateGalleryImageRequest): Observable<GalleryImage> {
    return this.http.post<GalleryImage>('/api/content/gallery', payload);
  }

  uploadGalleryImage(title: string, description: string, file: File): Observable<GalleryImage> {
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('file', file);
    return this.http.post<GalleryImage>('/api/content/gallery/upload', formData);
  }

  registerAccount(payload: RegisterAccountRequest): Observable<RegisterAccountResponse> {
    return this.http.post<RegisterAccountResponse>('/api/accounts/register', payload);
  }

  login(payload: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>('/api/accounts/login', payload);
  }

  createPoojaBooking(payload: PoojaBookingRequest): Observable<PoojaBookingResponse> {
    return this.http.post<PoojaBookingResponse>('/api/pooja-bookings', payload);
  }

  getUpcomingPoojaBookings(): Observable<UpcomingPoojaBooking[]> {
    return this.http.get<UpcomingPoojaBooking[]>('/api/pooja-bookings/upcoming');
  }

  changePassword(payload: ChangePasswordRequest): Observable<{ message: string }> {
    return this.http.post<{ message: string }>('/api/accounts/change-password', payload);
  }
}