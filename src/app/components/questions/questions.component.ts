import { Component, ElementRef, HostListener, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-questions',
  templateUrl: './questions.component.html',
  styleUrls: ['./questions.component.css']
})
export class QuestionsComponent {

  regions = [
    { admin: 'admin', creationDate: '2-11-2024', location: 'جده', testTitle: '277', supervisorNumber: '277', isMenuOpen: false },
    { admin: 'admin', creationDate: '2-11-2024', location: 'الرياض', testTitle: '399', supervisorNumber: '2', isMenuOpen: false },
    { admin: 'admin', creationDate: '2-11-2024', location: 'مكة المكرمة', testTitle: '590', supervisorNumber: '3', isMenuOpen: false }
    // Add more data as needed
  ];

  openMenuIndex: number | null = null;
  
  toggleMenu(item: any) {
    this.regions.forEach((region) => (region.isMenuOpen = false));
    item.isMenuOpen = !item.isMenuOpen;
  }

  showMenu(index: number) {
    this.regions[index].isMenuOpen = !this.regions[index].isMenuOpen;
  }

 @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    const target = event.target as HTMLElement;
    const menus = document.querySelectorAll('.dropdown-menu');
    const buttons = document.querySelectorAll('.ellipsis-btn');
    
    let clickedInside = false;

    menus.forEach((menu, index) => {
      if (menu.contains(target) || buttons[index].contains(target)) {
        clickedInside = true;
      }
    });

    if (!clickedInside) {
      // Close all menus when clicking outside
      this.regions.forEach(row => row.isMenuOpen = false);
    }
  }

  

  constructor(private elRef: ElementRef, private renderer: Renderer2) {}

 

  currentPage = 1;
totalPages = 10; // Replace with the actual total pages
pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);

goToPage(page: number) {
  this.currentPage = page;
  // Fetch or filter data based on the current page
}

previousPage() {
  if (this.currentPage > 1) {
    this.currentPage--;
    this.goToPage(this.currentPage);
  }
}

nextPage() {
  if (this.currentPage < this.totalPages) {
    this.currentPage++;
    this.goToPage(this.currentPage);
  }
 
}

addContractActive: boolean = true;  // Default the "إنشاء عقد جديد" button to active
exportPdfActive: boolean = false;   // Default the "تصدير PDF" button to inactive

// Toggle the "إنشاء عقد جديد" button active/inactive state
toggleAddContract() {
  this.addContractActive = true;
  this.exportPdfActive = false;  // Make "تصدير PDF" inactive
}

// Toggle the "تصدير PDF" button active/inactive state
toggleExportPdf() {
  this.exportPdfActive = true;
  this.addContractActive = false;  // Make "إنشاء عقد جديد" inactive
}


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
}
