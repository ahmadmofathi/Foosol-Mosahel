import { Component } from '@angular/core';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent {
  // isMenuVisible: boolean = false; // Initially hidden

  // toggleMenu() {
  //   this.isMenuVisible = !this.isMenuVisible; // Toggle the menu visibility
  // }


  cards = Array(9).fill({});

  // Array to track hidden cards
  hiddenCards = Array(9).fill(false);

  // Hide or delete a card by index
  hideCard(cardIndex: number) {
    this.hiddenCards[cardIndex] = true;
  }


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

  isMenuOpen = false;

  menuItems = [
    { icon: '../../../assets/images/student.svg', label: 'الطلاب' },
    { icon: '../../../assets/images/schedule.svg', label: 'الجدول' },
    { icon: '../../../assets/images/exam.svg', label: 'الاختبارات' },
    // Add more items as needed
  ];

  isNavbarOpen = false;
  isIconShow = false;
  isSettingBarOpen= false;
  
  openNav() {
    this.isNavbarOpen = !this.isNavbarOpen;
    this.showIcone();
  }
  
  showIcone(){
    this.isIconShow =true;
  }
  
  openSetting(){
    this.isSettingBarOpen = !this.isSettingBarOpen;
  }
  
  

  toggleStyle(event: any) {
    const divElement = event.target.closest('.custom-box'); 
  
    
    // Toggle styles
    if (divElement.style.backgroundColor === 'rgb(0, 26, 114)') { // if it's already the '001A72'
      divElement.style.backgroundColor = 'white';
      divElement.style.color = '#001A72';
    } else {
      divElement.style.backgroundColor = '#001A72';
      divElement.style.color = 'white';
    }
  }

  menuOpen = false;

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
    console.log('Menu Open State:', this.menuOpen); // Debugging
  }

 

  
}

