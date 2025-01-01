import { Component, ElementRef, HostListener, Renderer2 } from '@angular/core';

interface Skill {
  id: number;
  subjectName: string;
  className: string;
  description: string;
  isNew: boolean;
  showMenu: boolean;
}


@Component({
  selector: 'app-subscripe-details',
  templateUrl: './subscripe-details.component.html',
  styleUrls: ['./subscripe-details.component.css']
})
export class SubscripeDetailsComponent {

  isMenuOpen: { [key: number]: boolean } = {};


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



  skills: Skill[] = [
    // { id: 1, subjectName: 'Mathematics', className: 'Grade 5', description: 'Basic arithmetic and geometry skills', isNew: false, showMenu: false },
    // { id: 2, subjectName: 'Science', className: 'Grade 5', description: 'Introduction to biology and physics', isNew: false, showMenu: false },
    // { id: 3, subjectName: 'English', className: 'Grade 6', description: 'Grammar, reading, and writing skills', isNew: true, showMenu: false },
    // { id: 4, subjectName: 'History', className: 'Grade 7', description: 'Ancient civilizations and world history', isNew: false, showMenu: false },
    // { id: 5, subjectName: 'Physical Education', className: 'Grade 4', description: 'Physical fitness and basic sports skills', isNew: false, showMenu: false },
  ];


  constructor(private elRef: ElementRef, private renderer: Renderer2) {}

  ngOnInit() {
 
  }

  ngOnDestroy() {
    // Clean up the event listener when the component is destroyed
    this.renderer.listen('document', 'click', () => {});
  }

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


isListOpen = false;

columnsVisibility = {
 
  subject: false,
  class: false,
  stage: false,
  status: true,
  creationDate: true,
  phone: true,
  teacher: true,
  teacherNumber: true,
};

tableData = [
  {
    subject: 'Admin',
    class: '2-11-2024',
    stage: '277',
    status: 'مفعل',
    creationDate: '2-11-2024',
    phone: '277',
    teacher: 'أحمد علي',
    teacherNumber: '1',
  },
  // Add more rows as needed
];

toggleList() {
  this.isListOpen = !this.isListOpen;
}

updateVisibility(columnKey: string) {
  // Optional logic for handling visibility updates
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
