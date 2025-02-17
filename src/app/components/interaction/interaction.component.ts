import { Component, ElementRef, HostListener, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-interaction',
  templateUrl: './interaction.component.html',
  styleUrls: ['./interaction.component.css']
})
export class InteractionComponent {
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




  constructor(private elRef: ElementRef, private renderer: Renderer2) {}

  ngOnInit() {

  }

  ngOnDestroy() {
    // Clean up the event listener when the component is destroyed
    this.renderer.listen('document', 'click', () => {});
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

addContractActive: boolean = false;  // Default the "إنشاء عقد جديد" button to active
exportPdfActive: boolean = false;   // Default the "تصدير PDF" button to inactive
addDegreeActive :boolean = false;

isDateShow :boolean = false;

// Toggle the "إنشاء عقد جديد" button active/inactive state
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

toggleDegree(){
  this.exportPdfActive = false;
  this.addContractActive = false;  // Make "إنشاء عقد جديد" inactive
  this.addDegreeActive = true;
  this.isDateShow = false;
}



// Toggle dropdown visibility
toggleExportDropdown() {
  this.exportPdfActive = !this.exportPdfActive;
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

isMenuOpen: { [key: number]: boolean } = {};

@HostListener('document:click', ['$event'])
onClickOutside(event: MouseEvent): void {
  const target = event.target as HTMLElement;
  const menus = document.querySelectorAll('.dropdown-menu');
  const buttons = document.querySelectorAll('.ellipsis-btn');

  let clickedInside = false;
  menus.forEach((menu, index) => {
    if (menu.contains(target) || buttons[index]?.contains(target)) {
      clickedInside = true;
    }
  });

  if (!clickedInside) {
    this.regions.forEach(region => (region.isMenuOpen = false));
  }
}

showMenu(index: number): void {
  this.regions.forEach((region, i) => {
    region.isMenuOpen = i === index ? !region.isMenuOpen : false;
  });
}

}
