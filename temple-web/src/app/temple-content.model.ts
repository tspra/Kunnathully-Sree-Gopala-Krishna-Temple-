export interface AboutPageContent {
  templeName: string;
  title: string;
  description: string;
}

export interface UpdateAboutPageRequest {
  templeName: string;
  title: string;
  description: string;
}

export interface HomeNotice {
  label: string;
  title: string;
  description: string;
  darshanHeading: string;
  morningDarshanTime: string;
  eveningDarshanTime: string;
}

export interface UpdateHomeNoticeRequest {
  label: string;
  title: string;
  description: string;
  darshanHeading: string;
  morningDarshanTime: string;
  eveningDarshanTime: string;
}

export interface ScheduleItem {
  time: string;
  title: string;
  description: string;
  price: string;
  category: string;
}

export interface Offering {
  title: string;
  description: string;
  accent: string;
}

export interface TempleEvent {
  id?: number;
  title: string;
  date: string;
  description: string;
}

export interface CreateEventRequest {
  title: string;
  date: string;
  description: string;
}

export interface GalleryHighlight {
  title: string;
  description: string;
}

export interface DonationPlan {
  id?: number;
  title: string;
  description: string;
  imageUrl?: string;
}

export interface CreateDonationPlanRequest {
  title: string;
  description: string;
  imageUrl: string;
}

export interface DonateInfo {
  bankAccountName: string;
  bankAccountNumber: string;
  bankIfscCode: string;
  upiImageUrl: string;
}

export interface UpdateDonateInfoRequest {
  bankAccountName: string;
  bankAccountNumber: string;
  bankIfscCode: string;
  upiImageUrl: string;
}

export interface RegisterAccountRequest {
  name: string;
  address: string;
  email: string;
  mobileNumber: string;
  password: string;
}

export interface RegisterAccountResponse {
  id: number;
  name: string;
  email: string;
  mobileNumber: string;
  message: string;
}

export interface LoginRequest {
  emailOrMobile: string;
  password: string;
}

export interface LoginResponse {
  id: number;
  name: string;
  email: string;
  mobileNumber: string;
  role: string;
  token: string;
  expiresAtUtc: string;
  message: string;
}

export interface PoojaBookingRequest {
  name: string;
  mobileNumber: string;
  date: string;
  nalu: string;
  poojaType: string;
}

export interface PoojaBookingResponse {
  id: number;
  name: string;
  mobileNumber: string;
  date: string;
  nalu: string;
  poojaType: string;
  message: string;
}

export interface UpcomingPoojaBooking {
  id: number;
  name: string;
  mobileNumber: string;
  date: string;
  nalu: string;
  poojaType: string;
  createdAtUtc: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface VisitInfo {
  address: string;
  phone: string;
  email: string;
  visitingHours: string;
}

export interface UpdateVisitInfoRequest {
  address: string;
  phone: string;
  email: string;
  visitingHours: string;
}

export interface GalleryImage {
  id?: number;
  title: string;
  imageUrl: string;
  description: string;
}

export interface CreateGalleryImageRequest {
  title: string;
  imageUrl: string;
  description: string;
}

export interface TempleContent {
  hero: {
    eyebrow: string;
    title: string;
    subtitle: string;
    primaryAction: string;
    secondaryAction: string;
  };
  stats: Array<{ label: string; value: string }>;
  schedule: ScheduleItem[];
  offerings: Offering[];
  events: TempleEvent[];
  gallery: GalleryHighlight[];
  donationPlans: DonationPlan[];
  contact: VisitInfo;
}