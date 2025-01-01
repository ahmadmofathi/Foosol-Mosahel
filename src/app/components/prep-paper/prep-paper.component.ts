import { Component } from '@angular/core';

@Component({
  selector: 'app-prep-paper',
  templateUrl: './prep-paper.component.html',
  styleUrls: ['./prep-paper.component.css']
})
export class PrepPaperComponent {

  isMenuOpen = false;
  isNavbarOpen = false;
  isIconShow = false;
  isSettingBarOpen = false;
  menuOpen = false;

  currentIcons = {
    bell: '../../../assets/images/bell.svg',
    settings: '../../../assets/images/settings.svg',
    home: '../../../assets/images/home.svg',
  };

  // Track hover state
  isHovered = {
    bell: false,
    settings: false,
    home: false,
  };

  changeIcon(iconType: string, hover: boolean) {
    switch (iconType) {
      case 'bell':
        this.currentIcons.bell = hover
          ? '../../../assets/images/bellblue.png'
          : '../../../assets/images/bell.svg';
        this.isHovered.bell = hover;
        break;
      case 'settings':
        this.currentIcons.settings = hover
          ? '../../../assets/images/settingsBlue.png'
          : '../../../assets/images/settings.svg';
        this.isHovered.settings = hover;
        break;
      case 'home':
        this.currentIcons.home = hover
          ? '../../../assets/images/home-1.png'
          : '../../../assets/images/home.svg';
        this.isHovered.home = hover;
        break;
    }
  }

  openNav() {
    this.isNavbarOpen = !this.isNavbarOpen;
    this.showIcone();
  }

  showIcone() {
    this.isIconShow = true;
  }

  openSetting() {
    this.isSettingBarOpen = !this.isSettingBarOpen;
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
    console.log('Menu Open State:', this.menuOpen); // Debugging
  }


  isMenuVisible: boolean = false; // Initially hidden

 

  tests2 = []; // Assuming this is populated with your data
  isDropdownOpen: boolean[] = []; // Array to track dropdown states

  toggleDropdown2(index: number) {
      this.isDropdownOpen[index] = !this.isDropdownOpen[index]; // Toggle the state for the specific index
  }

  cards = Array(9).fill({});

  // Array to track hidden cards
  hiddenCards = Array(9).fill(false);

  // Hide or delete a card by index
  hideCard(cardIndex: number) {
    this.hiddenCards[cardIndex] = true;
  }
  terms = [1, 2, 3]; // Example data for terms
  tests = [
    { title: 'اختبار آخر الأسبوع', score: 50},
    { title: 'اختبار الشهر', score: 50 },
    { title: 'اختبار آخر الترم', score: 50 }
];

dropMenu = false

// toggleDropdown() {
//   this.dropMenu = !this.dropMenu;

// }

students: any[] = [
  { name: 'أسامة علي ال سعود', image: '../../../assets/images/student.png' },
  { name: 'أسامة علي ال سعود', image: '../../../assets/images/student.png' },
  { name: 'أسامة علي ال سعود', image: '../../../assets/images/student.png' },
  // add more students
];

dropdownIndex: number | null = null;


toggleDropdown(index: number): void {
  this.dropdownIndex = this.dropdownIndex === index ? null : index; // Toggle the dropdown
}



}
