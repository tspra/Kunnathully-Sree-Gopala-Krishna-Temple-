import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AboutPageContent } from '../temple-content.model';
import { TempleContentService } from '../temple-content.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-about-page',
  templateUrl: './about-page.component.html',
  styleUrls: ['./about-page.component.scss']
})
export class AboutPageComponent implements OnInit {
  @ViewChild('aboutForm') aboutForm!: NgForm;

  content: AboutPageContent = {
    templeName: 'കുന്നത്തുള്ളി ശ്രീ ഗോപാലകൃഷ്ണ ക്ഷേത്രം',
    title: 'ക്ഷേത്രത്തിന്റെ ചരിത്രം',
    description: 'Our temple preserves timeless traditions while welcoming every family with dignity, transparency, and care.'
  };
  loading = true;
  isAdmin = false;
  activeTab: 'view' | 'edit' = 'view';
  editForm = { templeName: '', title: '', description: '' };
  submitting = false;
  updateMessage = '';
  updateMessageType: 'success' | 'error' = 'success';

  constructor(private readonly contentService: TempleContentService, private readonly authService: AuthService) {}

  ngOnInit(): void {
    this.isAdmin = this.authService.isAdmin();
    this.loadContent();
  }

  loadContent(): void {
    this.contentService.getAboutContent().subscribe({
      next: (data: AboutPageContent) => {
        this.content = data;
        this.editForm = { ...data };
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading content:', err);
        this.loading = false;
      }
    });
  }

  setActiveTab(tab: 'view' | 'edit'): void {
    this.activeTab = tab;
    this.updateMessage = '';
  }

  submitEdit(): void {
    if (!this.editForm.templeName.trim() || !this.editForm.title.trim() || !this.editForm.description.trim()) {
      this.updateMessage = 'എല്ലാ ഫീൽഡുകളും പൂരിപ്പിക്കേണ്ടതാണ്.';
      this.updateMessageType = 'error';
      return;
    }

    this.submitting = true;
    this.updateMessage = '';
    
    // Debug: Log the data being sent
    console.log('Sending update request with data:', this.editForm);
    
    this.contentService.updateAboutContent(this.editForm as any).subscribe({
      next: (updatedContent: AboutPageContent) => {
        console.log('Update successful:', updatedContent);
        this.content = updatedContent;
        this.editForm = { ...updatedContent };
        this.submitting = false;
        this.updateMessage = 'ചരിത്രം വിജയകരമായി അപ്ഡേറ്റ് ചെയ്യപ്പെട്ടു!';
        this.updateMessageType = 'success';
        setTimeout(() => {
          this.updateMessage = '';
          this.activeTab = 'view';
        }, 2000);
      },
      error: (err) => {
        console.error('Error updating content:', err);
        console.error('Error status:', err?.status);
        console.error('Error body:', err?.error);
        this.submitting = false;
        this.updateMessageType = 'error';
        
        // Better error message extraction
        let errorMsg = 'ചരിത്രം അപ്ഡേറ്റ് ചെയ്യാൻ പരാജയപ്പെട്ടു. വീണ്ടും ശ്രമിക്കുക.';
        if (err?.error?.message) {
          errorMsg = err.error.message;
        } else if (err?.status === 401) {
          errorMsg = 'നിങ്ങൾ ലോഗിൻ ചെയ്യേണ്ടതുണ്ട്.';
        } else if (err?.status === 403) {
          errorMsg = 'നിങ്ങൾക്ക് ഈ നടപടിക്ക് അനുമതിയില്ല.';
        } else if (err?.status === 404) {
          errorMsg = 'ക്ഷേത്ര വിവരണം കണ്ടെത്തിയില്ല.';
        }
        this.updateMessage = errorMsg;
      }
    });
  }
}