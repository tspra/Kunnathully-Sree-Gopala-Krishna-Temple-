import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { HomeNotice, VisitInfo, UpdateVisitInfoRequest } from '../temple-content.model';
import { TempleContentService } from '../temple-content.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-contact-page',
  templateUrl: './contact-page-component.html',
  styleUrls: ['./contact-page-component.scss']
})
export class ContactPageComponent implements OnInit {
  @ViewChild('contactForm') contactForm!: NgForm;

  contactItems = [
    {
      label: 'ക്ഷേത്ര വിലാസം',
      value: ' കുന്നത്തുള്ളി ശ്രീ ഗോപാലകൃഷ്ണ ക്ഷേത്രം, വെങ്കിടങ്ങ് 680510, തൃശൂർ, കേരളം'
    },
    {
      label: 'ഫോൺ നമ്പർ',
      value: '+91 99999 99999'
    },
    {
      label: 'ഇമെയിൽ',
      value: 'info@kunnathulli-temple.org'
    }
  ];

  officeHours = [
    'രാവിലെ: 05:00 AM - 12:00 PM',
    'വൈകുന്നേരം: 05:00 PM - 08:00 PM'
  ];

  visitInfo: VisitInfo = {
    address: '',
    phone: '',
    email: '',
    visitingHours: ''
  };

  homeNotice: HomeNotice = {
    label: '',
    title: '',
    description: '',
    darshanHeading: '',
    morningDarshanTime: '05:00 AM - 12:00 PM',
    eveningDarshanTime: '05:00 PM - 08:00 PM'
  };

  isAdmin = false;
  activeTab: 'view' | 'edit' = 'view';
  editForm = { address: '', phone: '', email: '', visitingHours: '' };
  submitting = false;
  updateMessage = '';
  updateMessageType: 'success' | 'error' = 'success';
  loading = true;

  constructor(private readonly contentService: TempleContentService, private readonly authService: AuthService) {}

  ngOnInit(): void {
    this.isAdmin = this.authService.isAdmin();
    this.loadVisitInfo();
    this.loadHomeNotice();
  }

  get visitingHoursPlaceholder(): string {
    return `രാവിലെ: ${this.homeNotice.morningDarshanTime}\nവൈകുന്നേരം: ${this.homeNotice.eveningDarshanTime}`;
  }

  loadVisitInfo(): void {
    this.contentService.getVisitInfo().subscribe({
      next: (data: VisitInfo) => {
        this.visitInfo = data;
        this.editForm = { ...data };
        this.updateContactItems();
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading visit info:', err);
        this.loading = false;
      }
    });
  }

  loadHomeNotice(): void {
    this.contentService.getHomeNotice().subscribe({
      next: (notice: HomeNotice) => {
        this.homeNotice = notice;
        this.officeHours = [
          `രാവിലെ: ${notice.morningDarshanTime}`,
          `വൈകുന്നേരം: ${notice.eveningDarshanTime}`
        ];
      },
      error: (err) => {
        console.error('Error loading home notice for timings:', err);
      }
    });
  }

  updateContactItems(): void {
    this.contactItems = [
      {
        label: 'ക്ഷേത്ര വിലാസം',
        value: this.visitInfo.address
      },
      {
        label: 'ഫോൺ നമ്പർ',
        value: this.visitInfo.phone
      },
      {
        label: 'ഇമെയിൽ',
        value: this.visitInfo.email
      }
    ];
  }

  setActiveTab(tab: 'view' | 'edit'): void {
    this.activeTab = tab;
    this.updateMessage = '';
  }

  submitEdit(): void {
    if (!this.editForm.address.trim() || !this.editForm.phone.trim() || !this.editForm.email.trim() || !this.editForm.visitingHours.trim()) {
      this.updateMessage = 'എല്ലാ ഫീൽഡുകളും പൂരിപ്പിക്കേണ്ടതാണ്.';
      this.updateMessageType = 'error';
      return;
    }

    this.submitting = true;
    this.updateMessage = '';

    console.log('Submitting contact edit with data:', this.editForm);

    this.contentService.updateVisitInfo(this.editForm as any).subscribe({
      next: (updatedData: VisitInfo) => {
        console.log('Update successful:', updatedData);
        this.visitInfo = updatedData;
        this.editForm = { ...updatedData };
        this.updateContactItems();
        this.submitting = false;
        this.updateMessage = 'സമ്പർക്ക വിവരങ്ങൾ വിജയകരമായി അപ്ഡേറ്റ് ചെയ്യപ്പെട്ടു!';
        this.updateMessageType = 'success';
        setTimeout(() => {
          this.updateMessage = '';
          this.activeTab = 'view';
        }, 2000);
      },
      error: (err) => {
        console.error('Error updating contact info:', err);
        this.submitting = false;
        this.updateMessageType = 'error';
        
        let errorMsg = 'സമ്പർക്ക വിവരങ്ങൾ അപ്ഡേറ്റ് ചെയ്യാൻ പരാജയപ്പെട്ടു. വീണ്ടും ശ്രമിക്കുക.';
        if (err?.error?.message) {
          errorMsg = err.error.message;
        } else if (err?.status === 401) {
          errorMsg = 'നിങ്ങൾ ലോഗിൻ ചെയ്യേണ്ടതുണ്ട്.';
        } else if (err?.status === 403) {
          errorMsg = 'നിങ്ങൾക്ക് ഈ നടപടിക്ക് അനുമതിയില്ല.';
        } else if (err?.status === 404) {
          errorMsg = 'സമ്പർക്ക വിവരങ്ങൾ കണ്ടെത്തിയില്ല.';
        }
        this.updateMessage = errorMsg;
      }
    });
  }
}