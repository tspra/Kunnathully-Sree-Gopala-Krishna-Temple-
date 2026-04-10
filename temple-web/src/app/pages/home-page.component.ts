import { Component } from '@angular/core';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent {
  title = 'കുന്നത്തുള്ളി ശ്രീ ഗോപാലകൃഷ്ണ ക്ഷേത്രം';

  homeNotice = {
    label: 'ക്ഷേത്ര അറിയിപ്പ്',
    title: 'ഇന്നത്തെ പ്രധാന വിവരം',
    description: 'രാവിലെ 06:00 AM - 09:00 PM മുതൽ ദർശനം ലഭ്യമാണ്. വൈകുന്നേരം 05:30 PM - 08:00 PM വരെ വീണ്ടും ദർശനം ഉണ്ടായിരിക്കും.',
    darshanHeading: 'തിങ്കൾ മുതൽ ഞായർ വരെ',
    morningDarshanTime: '06:00 AM - 09:00 AM',
    eveningDarshanTime: '05:30 PM - 08:00 PM'
  };

}