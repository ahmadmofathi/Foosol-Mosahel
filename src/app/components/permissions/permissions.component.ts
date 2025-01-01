import { Component, ElementRef, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-permissions',
  templateUrl: './permissions.component.html',
  styleUrls: ['./permissions.component.css']
})
export class PermissionsComponent {

  regions = [
    { id: 1, name: 'جدة', subscribers: 277, date: '2-11-2024', user: 'admin', isMenuOpen: false },
    { id: 2, name: 'الرياض', subscribers: 399, date: '2-11-2024', user: 'admin', isMenuOpen: false },
    { id: 3, name: 'مكة المكرمة', subscribers: 590, date: '2-11-2024', user: 'admin', isMenuOpen: false },
    // Add more data as needed
  ];
  
  toggleMenu(item: any) {
    this.regions.forEach((region) => (region.isMenuOpen = false));
    item.isMenuOpen = !item.isMenuOpen;
  }

  isMenuOpen: boolean = false;

  constructor(private elRef: ElementRef, private renderer: Renderer2) {}

  ngOnInit() {
    // Add a global event listener when the component is initialized
    this.renderer.listen('document', 'click', (event: Event) => {
      if (!this.elRef.nativeElement.contains(event.target)) {
        this.isMenuOpen = false;
      }
    });
  }

  ngOnDestroy() {
    // Clean up the event listener when the component is destroyed
    this.renderer.listen('document', 'click', () => {});
  }

  // Function to toggle the dropdown menu
  showMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

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
isSettingBarOpen = false;

openNav() {
  this.isNavbarOpen = !this.isNavbarOpen;
  this.showIcon();
}

openSetting() {
  this.isSettingBarOpen = !this.isSettingBarOpen;
}

showIcon() {
  this.isIconShow = true;
}



}
