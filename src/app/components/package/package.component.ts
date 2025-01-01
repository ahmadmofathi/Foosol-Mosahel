import { Component, ElementRef, HostListener, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { PackagesService } from 'src/app/services/packages/packages.service';

interface Skill {
  id: number;
  subjectName: string;
  className: string;
  description: string;
  isNew: boolean;
  showMenu: boolean;
}

@Component({
  selector: 'app-package',
  templateUrl: './package.component.html',
  styleUrls: ['./package.component.css'],
})
export class PackageComponent {
  elements: any[] = [];
  packageForm: FormGroup;

  pageNumber: number = 1;
  pageSize: number = 10;

  constructor(
    private elRef: ElementRef,
    private renderer: Renderer2,
    private packges: PackagesService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    
  ) {
    this.packageForm = this.fb.group({
      name: ['', Validators.required],
      days:[Validators.required]
    });
  }


  ngOnInit() {
    this.getAllPackages()
  }

  getAllPackages() {

    const pageNumber = 1; // Example page number
    const pageSize = 10;


    this.packges.getAllPackages(pageNumber, pageSize).subscribe(
      (response) => {
        this.elements = response.items; // Make sure response contains 'id' field
        console.log('Fetched elements:', this.elements);
      },
      (error) => {
        console.error('Error fetching grades:', error);
      }
    );
  }

  addPackage() {
    if (this.packageForm.valid) {
      // Get the form data
      const packageData = this.packageForm.value;
      
      // Call the service to add the package
      this.packges.addPackage(packageData).subscribe(
        (response) => {
          this.getAllPackages();
          this.toastr.success('تم إضافة الباقه بنجاح!', 'نجاح', {
            timeOut: 1000,
          });
          console.log('Package added successfully:', response);
          // You can handle success logic, such as displaying a message or navigating elsewhere
        },
        (error) => {
          console.error('Error adding package:', error);
          // Handle error logic here, like showing an error message
        }
      );
    } else {
      console.log('Form is not valid');
    }
  }

  onDeletePackage(packageId: string): void {
    this.packges.deletePackage(packageId).subscribe({
      next: (response) => {
        this.toastr.success('تم حذف الباقه بنجاح!', 'نجاح', {
          timeOut: 1000,
        });
        this.getAllPackages()
      },
      error: (error) => {
        console.error('Error deleting package:', error);
        alert('Failed to delete package.');
      },
    });
  }


  regions = [
    {
      id: 1,
      name: 'جدة',
      subscribers: 277,
      date: '2-11-2024',
      user: 'admin',
      isMenuOpen: false,
    },
    {
      id: 2,
      name: 'الرياض',
      subscribers: 399,
      date: '2-11-2024',
      user: 'admin',
      isMenuOpen: false,
    },
    {
      id: 3,
      name: 'مكة المكرمة',
      subscribers: 590,
      date: '2-11-2024',
      user: 'admin',
      isMenuOpen: false,
    },
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

  addContractActive: boolean = true; // Default the "إنشاء عقد جديد" button to active
  exportPdfActive: boolean = false; // Default the "تصدير PDF" button to inactive

  // Toggle the "إنشاء عقد جديد" button active/inactive state
  toggleAddContract() {
    this.addContractActive = true;
    this.exportPdfActive = false; // Make "تصدير PDF" inactive
  }

  // Toggle the "تصدير PDF" button active/inactive state
  toggleExportPdf() {
    this.exportPdfActive = true;
    this.addContractActive = false; // Make "إنشاء عقد جديد" inactive
  }
  isNavbarOpen = false;
  isIconShow = false;
  isSettingBarOpen = false;

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
      this.elements.forEach((region) => (region.isMenuOpen = false));
    }
  }

  showMenu(index: number): void {
    this.elements.forEach((region, i) => {
      region.isMenuOpen = i === index ? !region.isMenuOpen : false;
    });
  }
}
