import { Component, ElementRef, HostListener, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent {

  regions = [
    { id: 1, name: 'جدة', status: 'مفعل', subscribers: 277, date: '2-11-2024', user: 'admin', isMenuOpen: false },
    { id: 2, name: 'الرياض', status: 'مفعل', subscribers: 399, date: '2-11-2024', user: 'admin', isMenuOpen: false },
    { id: 3, name: 'مكة المكرمة', status: 'مفعل', subscribers: 590, date: '2-11-2024', user: 'admin', isMenuOpen: false },
    // Add more data as needed
  ];
  
  isMenuOpen: { [key: number]: boolean } = {};
  elements: any[] = [];

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




  updateStatusColor(): void {
  }

  isNavbarOpen = false;
isIconShow = false;

openNav() {
  this.isNavbarOpen = !this.isNavbarOpen;
  this.showIcone();
}

showIcone(){
  this.isIconShow =true;
}

dropdownOpen: boolean = false;
status1: string = 'مفعل'; // Default selected option
options: string[] = ['مفعل', 'معطل'];
hoveredOption: string | null = null;

toggleDropdown() {
  this.dropdownOpen = !this.dropdownOpen;
}

selectOption(option: string) {
  this.status1 = option;
  this.dropdownOpen = false;
}


}
