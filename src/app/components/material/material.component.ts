import { Component, ElementRef, HostListener, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GradeService } from 'src/app/services/grade/grade.service';
import { LevelService } from 'src/app/services/level/level.service';
import { SubjectService } from 'src/app/services/subject/subject.service';
import { ToastrService } from 'ngx-toastr';
import { Modal } from 'bootstrap';

@Component({
  selector: 'app-material',
  templateUrl: './material.component.html',
  styleUrls: ['./material.component.css'],
  host: {
    '(document:click)': 'onClick($event)', // Listen for document clicks
  },
})
export class MaterialComponent {
  elements: any[] = [];
  grades: any[] = [];
  subjectForm: FormGroup;
  selectedItemId: number | null = null; // Store the ID of the item to delete
  isMenuOpen: { [key: number]: boolean } = {};
 activeMenuIndex: number | null = null; // Track the currently active menu index
  private globalClickListener!: () => void;
  isEditMode = false;
  currentSubjectId: string = '';
  addContractActive = true;
  exportPdfActive = false;
  


  

    
  @ViewChild('createModal', { static: true }) createModal!: ElementRef;
  private modalInstance!: Modal;


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
      this.elements.forEach(region => (region.isMenuOpen = false));
    }
  }
  // Toggle the dropdown menu visibility based on index
  showMenu(index: number): void {
    this.elements.forEach((region, i) => {
      region.isMenuOpen = i === index ? !region.isMenuOpen : false;
    });
  }



  constructor(
    private renderer: Renderer2,
    private _eref: ElementRef,
    private fb: FormBuilder,
    private gradeService: GradeService,
    private levelService: LevelService,
    private toastr: ToastrService,
    private subjectService:SubjectService
  ) {
    this.subjectForm = this.fb.group({
      subjectName: ['', Validators.required],
      gradeId: ['', Validators.required],
    });
  }

  ngOnInit() {
  this.getAllSubjects();
  this.getAllGrades();

  }

  isSubmitting = false;

  openModalForAdd(): void {
    this.isEditMode = false; // Set mode to Add
    this.subjectForm.reset(); // Clear the form for adding new data
    this.subjectForm.get('gradeId')?.enable(); // Enable gradeId field
    this.currentSubjectId = ''; // Clear currentSubjectId for Add mode
  
    // Open the modal
    const modalElement = document.getElementById('addModal');
    if (modalElement) {
      const modalInstance = Modal.getOrCreateInstance(modalElement); // Get or create instance
      modalInstance.show(); // Show the modal
    }
  }
  
  openModalForEdit(subject: any) {
    this.currentSubjectId = subject.subjectId; // Set the currentSubjectId from the selected subject
    this.isEditMode = true;
  
    // Patch the form with subjectName and disable gradeId
    this.subjectForm.patchValue({
      subjectName: subject.subjectName,
    });
  
    // Disable the gradeId field to prevent it from being changed
    this.subjectForm.get('gradeId')?.disable(); // Disable gradeId field
  }
  
  
  
  
  onSubmit(): void {
    if (this.isEditMode) {
      this.onSubmitUpdate(); // Handle update
    } else {
      this.onSubmitAdd(); // Handle addition
    }
  }
  

  onSubmitAdd() {
    if (this.subjectForm.valid) {
      const formData = this.subjectForm.value; // Extract form data
      this.subjectService.addSubject(formData.gradeId, formData).subscribe(
        () => {
          this.toastr.success('تم إضافة الماده بنجاح!', 'نجاح', {
            timeOut: 1000,
          });
          this.getAllSubjects(); // Refresh the subject list
          this.closeModalById('addModal'); // Close modal
        },
        (error) => this.handleError(error)
      );
    }
  }
  


 onSubmitUpdate(): void {
  if (this.subjectForm.valid && this.currentSubjectId) {
    // Extract the form data while excluding disabled fields like gradeId
    const updatedData = {
      subjectName: this.subjectForm.get('subjectName')?.value,
    };

    this.subjectService.updateSubject(this.currentSubjectId, updatedData).subscribe(
      (response) => {
        this.toastr.success('تم تحديث الماده بنجاح!', 'نجاح', {
          timeOut: 2000,
        });
        this.getAllSubjects(); // Refresh the subject list
        this.closeModalById('editModal'); // Close modal
      },
      (error) => {
        this.toastr.error('خطأ أثناء تحديث الماده', 'خطأ', { timeOut: 2000 });
        console.error('Update subject error:', error);
      }
    );
  }
}


  


  getAllSubjects() {
    this.subjectService.getAllSubjects().subscribe(
      (response) => {
        this.elements = response; // Make sure response contains 'id' field
        console.log('Fetched elements:', this.elements);
      },
      (error) => {
        console.error('Error fetching grades:', error);
      }
    );
  }

  getAllGrades() {
    this.gradeService.getAllGrades().subscribe((response) => {
      this.grades = response;
    }, this.handleError);
  }


   // Deletion
   deleteSubject(subjectId: string, index: number) {
    this.subjectService.deleteSubject(subjectId).subscribe(() => {
      this.elements.splice(index, 1);
      this.toastr.success('تم مسح هذه الماده بنجاح!', 'تم المسح', {
          timeOut: 2000, // Display for 2 seconds
        });
    }, this.handleError);
    this.closeModal()
  }




  // Pagination
  currentPage = 1;
  totalPages = 10; // Example total pages
  pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);

  // Navbar and settings state
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
  
  openMenuIndex: number | null = null;
  
  toggleMenu(item: any): void {
    // Close all menus first
    this.elements.forEach((region) => (region.isMenuOpen = false));
    // Toggle the clicked item's menu
    item.isMenuOpen = !item.isMenuOpen;
  }




  



  stopPropagation(event: Event) {
    event.stopPropagation();
  }

  // Pagination
  goToPage(page: number) {
    this.currentPage = page;
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

  // Error handling
  private handleError(error: any) {
    console.error('An error occurred:', error);
  }

  closeModalById(modalId: string): void {
    const modalElement = document.getElementById(modalId);
    if (modalElement) {
      const modalInstance = Modal.getInstance(modalElement);
      modalInstance?.hide(); // Close the modal
      Modal.getOrCreateInstance(modalElement)?.dispose(); // Dispose of modal instance
    }
  
    // Clean up Bootstrap modal styles
    document.querySelectorAll('.modal-backdrop').forEach(backdrop => backdrop.remove());
    document.body.classList.remove('modal-open');
    document.body.style.removeProperty('overflow');
    document.body.style.removeProperty('padding-right');
  }
  
  openAddModal() {
    // Reset the form fields to clear any previous data
    this.subjectForm.reset();
  
    // Set the flag to false since this is "Add" mode, not "Edit"
    this.isEditMode = false;
  
    // Clear any selected grade ID, if any
    this.currentSubjectId = '';
  
    // Re-enable the gradeId field (in case it was disabled in edit mode)
    this.subjectForm.get('gradeId')?.enable();
  
    // Open the modal using Bootstrap modal API
    const modalElement = document.getElementById('addModal');
    if (modalElement) {
      const modalInstance = Modal.getOrCreateInstance(modalElement); // Get or create instance
      modalInstance.show(); // Show the modal
    } else {
      console.error('Add modal element not found.');
    }
  }
  





    // UI toggles
    toggleAddContract() {
      this.addContractActive = true;
      this.exportPdfActive = false;
      this.openAddModal() 
    }
  
    toggleExportPdf() {
      this.exportPdfActive = true;
      this.addContractActive = false;
    }
  




    ngAfterViewInit(): void {
      this.initializeModal();
    }
    
    initializeModal(): void {
      const modalElement = this.createModal.nativeElement;
      this.modalInstance = new Modal(modalElement, {
        backdrop: 'static',
        keyboard: false,
      });
    }

    // ngAfterViewInit(): void {
    //   const modalElement = document.getElementById('createModal');
    //   if (modalElement) {
    //     this.modalInstance = new Modal(modalElement, {
    //       backdrop: 'static',
    //       keyboard: false,
    //     });
    //   }
    // }
    
  
    // openModal(): void {
    //   // Reinitialize modal to ensure it's ready to show
    //   if (!this.modalInstance) {
    //     this.initializeModal();
    //   }
    //   this.modalInstance.show();
    // }
    

    closeModal(): void {
      if (this.modalInstance) {
        this.modalInstance.hide();
      }
    
      // Clean up modal artifacts (backdrop, body styles)
      const backdrops = document.querySelectorAll('.modal-backdrop');
      backdrops.forEach((backdrop) => backdrop.remove());
      document.body.classList.remove('modal-open');
      document.body.style.removeProperty('overflow');
      document.body.style.removeProperty('padding-right');
    
      // Clear modal instance if necessary to avoid conflicts
      this.modalInstance = undefined!;
    }
    
  
}
