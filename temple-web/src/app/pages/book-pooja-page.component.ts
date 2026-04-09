import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PoojaBookingRequest } from '../temple-content.model';
import { TempleContentService } from '../temple-content.service';

@Component({
  selector: 'app-book-pooja-page',
  templateUrl: './book-pooja-page.component.html',
  styleUrls: ['./book-pooja-page.component.scss']
})
export class BookPoojaPageComponent {
  readonly naluOptions: string[] = [
    'Ashwathi (അശ്വതി)',
    'Bharani (ഭരണി)',
    'Karthika (കാർത്തിക)',
    'Rohini (രോഹിണി)',
    'Makayiram (മകയിരം)',
    'Thiruvathira (തിരുവാതിര)',
    'Punartham (പുണർതം)',
    'Pooyam (പൂയം)',
    'Ayilyam (ആയില്യം)',
    'Makam (മകം)',
    'Pooram (പൂരം)',
    'Uthram (ഉത്രം)',
    'Atham (അത്തം)',
    'Chithira (ചിത്തിര)',
    'Chothi (ചോതി)',
    'Vishakham (വിശാഖം)',
    'Anizham (അനിഴം)',
    'Thriketta (തൃക്കേട്ട)',
    'Moolam (മൂലം)',
    'Pooradam (പൂരാടം)',
    'Uthradam (ഉത്രാടം)',
    'Thiruvonam (തിരുവോണം)',
    'Avittam (അവിട്ടം)',
    'Chathayam (ചതയം)',
    'Pooruruttathi (പൂരുരുട്ടാതി)',
    'Uthruttathi (ഉത്രട്ടാതി)',
    'Revathi (രേവതി)'
  ];

  formData: PoojaBookingRequest = {
    name: '',
    mobileNumber: '',
    date: '',
    nalu: '',
    poojaType: ''
  };
  isSubmitting = false;
  successMessage = '';
  errorMessage = '';

  constructor(
    private readonly contentService: TempleContentService,
    private readonly route: ActivatedRoute
  ) {
    this.route.queryParamMap.subscribe((params) => {
      const poojaType = params.get('poojaType');
      if (poojaType) {
        this.formData.poojaType = poojaType;
      }
    });
  }

  submit(): void {
    this.successMessage = '';
    this.errorMessage = '';
    this.isSubmitting = true;

    this.contentService.createPoojaBooking(this.formData).subscribe({
      next: () => {
        this.successMessage = 'പൂജ ബുക്കിംഗ് വിവരങ്ങൾ വിജയകരമായി സ്വീകരിച്ചു.';
        this.formData = {
          name: '',
          mobileNumber: '',
          date: '',
          nalu: '',
          poojaType: this.formData.poojaType
        };
        this.isSubmitting = false;
      },
      error: (error) => {
        this.errorMessage = error?.error?.message ?? 'ബുക്കിംഗ് പരാജയപ്പെട്ടു. വീണ്ടും ശ്രമിക്കുക.';
        this.isSubmitting = false;
      }
    });
  }
}
