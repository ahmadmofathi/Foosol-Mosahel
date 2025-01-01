import { Component } from '@angular/core';

@Component({
  selector: 'app-actions',
  templateUrl: './actions.component.html',
  styleUrls: ['./actions.component.css']
})
export class ActionsComponent {
  isMenuOpen = false;
  isNavbarOpen = false;
  isIconShow = false;
  isSettingBarOpen = false;
  menuOpen = false;

  isDateShow :boolean = false;
  addContractActive: boolean = false;  // Default the "إنشاء عقد جديد" button to active
exportPdfActive: boolean = false;   // Default the "تصدير PDF" button to inactive
addDegreeActive :boolean = false;

  toggleDegree(){
    this.exportPdfActive = false;
    this.addContractActive = false;  // Make "إنشاء عقد جديد" inactive
    this.addDegreeActive = true;
    this.isDateShow = false;
  }
  
  toggleAddContract() {
    this.addContractActive = true;
    this.exportPdfActive = false;  // Make "تصدير PDF" inactive
    this.addDegreeActive = false;
    this.isDateShow = true;
  }
  
  // Toggle the "تصدير PDF" button active/inactive state
  toggleExportPdf() {
    this.exportPdfActive = true;
    this.addContractActive = false;  // Make "إنشاء عقد جديد" inactive
    this.addDegreeActive = false;
    this.isDateShow = false;
  
  }

  toggleExportDropdown() {
    this.exportPdfActive = !this.exportPdfActive;
  }

  toggleDateRow(): void {
    this.isDateShow = !this.isDateShow; // Toggle the visibility
  }

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


  cards = [
    { number: '1', label: 'كشف متابعه ', content: ' الفتره الاولي', date: '' , activeButton: '' ,  isMenuOpen: false},
    { number: '2', label: 'كشف متابعه ', content: ' الفتره الاولي', date: '' , activeButton: '' ,  isMenuOpen: false},
    { number: '3', label: 'كشف متابعه ', content: ' الفتره الاولي', date: '' , activeButton: '' ,  isMenuOpen: false},
    { number: '4', label: 'كشف متابعه ', content: ' الفتره الاولي', date: '' , activeButton: '' ,  isMenuOpen: false},
    // Add more card objects as needed
  ];

  onButtonClick(card: any, buttonType: string) {
    card.activeButton = buttonType; // Set the active button for each card individually
    console.log(`Button ${buttonType} clicked for card ${card.number}`);
    // Add any additional logic, like opening a modal or sending data
  }

  
  toggleMenu2(card: any): void {
    card.isMenuOpen = !card.isMenuOpen; 
  }

  // Method to handle menu actions (Delete, Edit, Download)
  menuAction(action: string): void {
    console.log(`Action: ${action}`);
    // Add custom logic for each action here (e.g., opening modals, handling downloads, etc.)
  }

  buttons: string[] = ['كشف الحضور', 'كشف السلوكيات', 'كشف التفاعل', 'كشف المتابعة'];
  activeButton: number = 2; // Default active button index (for example, the last button)
  routes: string[] = ['/', '/behaive', '/actions', '/following'];

  setActiveButton(index: number): void {
    this.activeButton = index;
  }

  getRouterLink(index: number): string {
    return this.routes[index] || '/';
  }

}
