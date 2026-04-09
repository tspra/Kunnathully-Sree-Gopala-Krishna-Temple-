import { Component, OnInit } from '@angular/core';
import { DonationPlan, HomeNotice, TempleEvent } from '../temple-content.model';
import { AuthService } from '../auth.service';
import { TempleContentService } from '../temple-content.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit {
  title = 'കുന്നത്തുള്ളി ശ്രീ ഗോപാലകൃഷ്ണ ക്ഷേത്രം';
  latestNews: TempleEvent[] = [];
  donationNews: DonationPlan[] = [];
  homeNotice: HomeNotice = {
    label: 'ക്ഷേത്ര അറിയിപ്പ്',
    title: 'ഇന്നത്തെ പ്രധാന വിവരം',
    description: 'രാവിലെ 06:00 മുതൽ 09:00 വരെ ദർശനം ലഭ്യമാണ്. വൈകുന്നേരം 05:00 മുതൽ 08:00 വരെ വീണ്ടും ദർശനം ഉണ്ടായിരിക്കും.',
    darshanHeading: 'തിങ്കൾ മുതൽ ഞായർ വരെ',
    morningDarshanTime: '05:00 AM - 12:00 PM',
    eveningDarshanTime: '05:00 PM - 08:00 PM'
  };
  isAdmin = false;
  homeNoticeTab: 'view' | 'edit' = 'view';
  homeNoticeForm = {
    label: '',
    title: '',
    description: '',
    darshanHeading: '',
    morningDarshanTime: '',
    eveningDarshanTime: ''
  };
  savingHomeNotice = false;
  homeNoticeMessage = '';
  homeNoticeMessageType: 'success' | 'error' = 'success';
  darshanTab: 'view' | 'edit' = 'view';
  darshanForm = {
    darshanHeading: '',
    morningDarshanTime: '',
    eveningDarshanTime: ''
  };
  savingDarshan = false;
  darshanMessage = '';
  darshanMessageType: 'success' | 'error' = 'success';

  constructor(
    private readonly contentService: TempleContentService,
    private readonly authService: AuthService
  ) {}

  ngOnInit(): void {
    this.isAdmin = this.authService.isAdmin();

    this.contentService.getHomeNotice().subscribe({
      next: (notice: HomeNotice) => {
        this.homeNotice = notice;
        this.homeNoticeForm = { ...notice };
        this.darshanForm = {
          darshanHeading: notice.darshanHeading,
          morningDarshanTime: notice.morningDarshanTime,
          eveningDarshanTime: notice.eveningDarshanTime
        };
      }
    });

    this.contentService.getEvents().subscribe((items: TempleEvent[]) => {
      this.latestNews = items.slice(0, 3);
    });

    this.contentService.getDonationPlans().subscribe((plans: DonationPlan[]) => {
      this.donationNews = plans.slice(0, 3);
    });
  }

  setHomeNoticeTab(tab: 'view' | 'edit'): void {
    this.homeNoticeTab = tab;
    this.homeNoticeMessage = '';

    if (tab === 'edit') {
      this.syncHomeNoticeFormDescription();
    }
  }

  syncHomeNoticeFormDescription(): void {
    const morning = this.homeNoticeForm.morningDarshanTime?.trim();
    const evening = this.homeNoticeForm.eveningDarshanTime?.trim();

    if (!morning || !evening) {
      return;
    }

    this.homeNoticeForm.description = `രാവിലെ ${morning} മുതൽ ദർശനം ലഭ്യമാണ്. വൈകുന്നേരം ${evening} വരെ വീണ്ടും ദർശനം ഉണ്ടായിരിക്കും.`;
  }

  get syncedHomeNoticeDescription(): string {
    if (!this.homeNotice.morningDarshanTime || !this.homeNotice.eveningDarshanTime) {
      return this.homeNotice.description;
    }

    return `രാവിലെ ${this.homeNotice.morningDarshanTime} മുതൽ ദർശനം ലഭ്യമാണ്. വൈകുന്നേരം ${this.homeNotice.eveningDarshanTime} വരെ വീണ്ടും ദർശനം ഉണ്ടായിരിക്കും.`;
  }

  setDarshanTab(tab: 'view' | 'edit'): void {
    this.darshanTab = tab;
    this.darshanMessage = '';
  }

  saveHomeNotice(): void {
    this.syncHomeNoticeFormDescription();

    if (!this.homeNoticeForm.label.trim() || !this.homeNoticeForm.title.trim() || !this.homeNoticeForm.description.trim() || !this.homeNoticeForm.darshanHeading.trim() || !this.homeNoticeForm.morningDarshanTime.trim() || !this.homeNoticeForm.eveningDarshanTime.trim()) {
      this.homeNoticeMessage = 'എല്ലാ ഫീൽഡുകളും പൂരിപ്പിക്കേണ്ടതാണ്.';
      this.homeNoticeMessageType = 'error';
      return;
    }

    this.savingHomeNotice = true;
    this.homeNoticeMessage = '';

    this.contentService.updateHomeNotice(this.homeNoticeForm).subscribe({
      next: (notice: HomeNotice) => {
        this.homeNotice = notice;
        this.homeNoticeForm = { ...notice };
        this.darshanForm = {
          darshanHeading: notice.darshanHeading,
          morningDarshanTime: notice.morningDarshanTime,
          eveningDarshanTime: notice.eveningDarshanTime
        };
        this.savingHomeNotice = false;
        this.homeNoticeMessage = 'അറിയിപ്പ് വിജയകരമായി അപ്ഡേറ്റ് ചെയ്തു.';
        this.homeNoticeMessageType = 'success';
        this.homeNoticeTab = 'view';
      },
      error: (err) => {
        this.savingHomeNotice = false;
        this.homeNoticeMessageType = 'error';
        this.homeNoticeMessage = err?.error?.message || 'അറിയിപ്പ് അപ്ഡേറ്റ് ചെയ്യാൻ കഴിഞ്ഞില്ല.';
      }
    });
  }

  saveDarshan(): void {
    if (!this.darshanForm.darshanHeading.trim() || !this.darshanForm.morningDarshanTime.trim() || !this.darshanForm.eveningDarshanTime.trim()) {
      this.darshanMessage = 'എല്ലാ ഫീൽഡുകളും പൂരിപ്പിക്കേണ്ടതാണ്.';
      this.darshanMessageType = 'error';
      return;
    }

    this.savingDarshan = true;
    this.darshanMessage = '';

    const payload = {
      ...this.homeNotice,
      darshanHeading: this.darshanForm.darshanHeading,
      morningDarshanTime: this.darshanForm.morningDarshanTime,
      eveningDarshanTime: this.darshanForm.eveningDarshanTime
    };

    this.contentService.updateHomeNotice(payload).subscribe({
      next: (notice: HomeNotice) => {
        this.homeNotice = notice;
        this.homeNoticeForm = { ...notice };
        this.darshanForm = {
          darshanHeading: notice.darshanHeading,
          morningDarshanTime: notice.morningDarshanTime,
          eveningDarshanTime: notice.eveningDarshanTime
        };
        this.savingDarshan = false;
        this.darshanMessage = 'ദർശന സമയം വിജയകരമായി അപ്ഡേറ്റ് ചെയ്തു.';
        this.darshanMessageType = 'success';
        this.darshanTab = 'view';
      },
      error: (err) => {
        this.savingDarshan = false;
        this.darshanMessageType = 'error';
        this.darshanMessage = err?.error?.message || 'ദർശന സമയം അപ്ഡേറ്റ് ചെയ്യാൻ കഴിഞ്ഞില്ല.';
      }
    });
  }
}