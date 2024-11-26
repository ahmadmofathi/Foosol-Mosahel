import { Component } from '@angular/core';

@Component({
  selector: 'app-lesson',
  templateUrl: './lesson.component.html',
  styleUrls: ['./lesson.component.css']
})
export class LessonComponent {

  isMenuVisible: boolean = false; // Initially hidden

  toggleMenu() {
    this.isMenuVisible = !this.isMenuVisible; // Toggle the menu visibility
  }

  toggleStyle(event: any) {
    const divElement = event.target.closest('.custom-box'); // Find the closest div with class 'custom-box'
    
    // Toggle styles
    if (divElement.style.backgroundColor === 'rgb(0, 26, 114)') { // if it's already the '001A72'
      divElement.style.backgroundColor = '#D9D9D9';
      divElement.style.color = '#001A72';
    } else {
      divElement.style.backgroundColor = '#001A72';
      divElement.style.color = '#D9D9D9';
    }
  }

  cards = [
    { title: 'رفع الدرس PDF' },
    { title: 'رفع الصور' },
    { title: 'رفع فيديو' },
    { title: 'تجهيز التقويم' },
    { title: 'اوراق عمل' },
    { title: 'رفع بوربوينت' },
    { title: 'رفع اي ملف اضافي' },
    { title: 'رفع اي ملف اضافي' },
    { title: 'رفع اي ملف اضافي' }
  ];

  // Array to track hidden cards
  hiddenCards = Array(9).fill(false);

  // Hide or delete a card by index
  hideCard(cardIndex: number) {
    this.hiddenCards[cardIndex] = true;
  }

  // Uploaded files and images tracking
  uploadedFiles: (File | null)[] = Array(9).fill(null);
  uploadedImages: (string | null)[] = Array(9).fill(null);

  // Opens the file input dialog for the specific card
  openFileInput(cardIndex: number) {
    const fileInput = document.querySelectorAll<HTMLInputElement>('input[type="file"]')[cardIndex];
    fileInput.click();
  }

  // Handles file attachment
  attachFile(event: Event, cardIndex: number) {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files[0]) {
      const file = fileInput.files[0];

      // Check if the file is an image
      if (file.type.startsWith('image/')) {
        this.uploadedFiles[cardIndex] = file;
        this.uploadedImages[cardIndex] = URL.createObjectURL(file);
      } else {
        console.warn("Please upload an image file.");
      }
    }
  }

  // Removes the file and image from a specific card
  removeFile(cardIndex: number) {
    this.uploadedFiles[cardIndex] = null;
    this.uploadedImages[cardIndex] = null;
  }


}
