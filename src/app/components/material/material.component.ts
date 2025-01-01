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
  
  pageNumber = 1; // Current page
  itemsPerPage = 8; // Items per page
  totalItems = 9; // Initial total items
  maxVisiblePages = 5; // Maximum number of visible pages
  pages: number[] = []; // Array to hold the visible pages
  hasMoreData = true; // Flag to check if more data exists




  

    
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
    this.updatePagination();
    this.subjectForm = this.fb.group({
      subjectName: ['', Validators.required],
      gradeId: [ Validators.required],
    });

  }

  ngOnInit() {
  this.getAllSubjects();
  this.getAllGrades();

  }

  selectedGrade: any = null;


  onSelectFocus() {
    // This function is triggered when the select element is focused
    if (this.selectedGrade === null) {
      // Ensure the placeholder is shown when the select is focused and empty
      this.selectedGrade = null;
    }
  }

  onSelectBlur() {
    // This function is triggered when the select element loses focus
    if (!this.selectedGrade) {
      // Keep the placeholder visible if no grade is selected
      this.selectedGrade = null;
    }
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

    if (this.subjectForm.invalid) {
      // Check for specific errors in the form
      this.toastr.error('يرجى تعبئة جميع الحقول المطلوبة!', 'خطأ', {
        timeOut: 2000, // Display for 2 seconds
      });
      return; // Stop further processing if the form is invalid
    }



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


    this.subjectService.getAllSub(this.pageNumber, this.itemsPerPage).subscribe(
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

 

    this.gradeService.getAllClasses(this.pageNumber, this.itemsPerPage).subscribe(
      (response) => {
        this.grades = response; // Ensure this is an array of grade objects
        console.log('Grades:', this.grades); // Check if the grades are correctly assigned
      },
      (error) => {
        this.handleError(error);
      }
    );
  }
  

  changePage(page: number): void {
    // Ensure we are not navigating beyond the available pages
    if (page >= 1 && page <= this.totalPages && page !== this.pageNumber) {
      this.pageNumber = page;
      this.getAllSubjects();

      // If on the last page, try to load more data
      if (page === this.totalPages && this.hasMoreData) {
        this.fetchMoreData();
        this.getAllSubjects();
      }
    }
  }

  // Simulate fetching more data
  fetchMoreData(): void {
    // Assuming that the total number of items won't exceed 20
    if (this.totalItems < 20) {
      this.addItems(4); // Add 4 more items to test
    } else {
      this.hasMoreData = false; // Stop adding more items
    }
  }

  // Add items dynamically and update pagination
  addItems(count: number): void {
    this.totalItems += count;
    this.updatePagination();
  }

  // Update pagination logic
  updatePagination(): void {
    const totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
    
    // Dynamically update pages array based on actual data
    this.pages = [];

    if (totalPages <= this.maxVisiblePages) {
      // If total pages are less than or equal to max visible pages, show all
      this.pages = Array.from({ length: totalPages }, (_, i) => i + 1);
    } else {
      // If there are more pages, show the first 'maxVisiblePages' pages
      this.pages = Array.from({ length: this.maxVisiblePages }, (_, i) => i + 1);
    }
  }

  // Get total pages
  get totalPages(): number {
    return Math.ceil(this.totalItems / this.itemsPerPage);
  }

   // Deletion
  //  deleteSubject(subjectId: string, index: number) {
  //   this.subjectService.deleteSubject(subjectId).subscribe(() => {
  //     this.elements.splice(index, 1);
  //     this.toastr.success('تم مسح هذه الماده بنجاح!', 'تم المسح', {
  //         timeOut: 2000, // Display for 2 seconds
  //       });
  //   }, this.handleError);
  //   this.closeModal()
  // }


  selectedSubjectId: string | null = null;
  selectedSubjectIndex: number | null = null;

  // Open the confirmation modal
  openSubjectConfirmModal(subjectId: string, index: number): void {
    this.selectedSubjectId = subjectId;
    this.selectedSubjectIndex = index;

    const modalElement = document.getElementById('deleteSubjectModal');
    if (modalElement) {
      const modalInstance = new Modal(modalElement);
      modalInstance.show();
    }
  }

  // Confirm deletion of the subject
  confirmDeleteSubject(): void {
    if (this.selectedSubjectId != null && this.selectedSubjectIndex != null) {
      this.subjectService.deleteSubject(this.selectedSubjectId).subscribe(
        () => {
          // Remove the subject from the list if deletion was successful
          if (this.selectedSubjectIndex !== null) {
            this.elements.splice(this.selectedSubjectIndex, 1);
          }

          // Show success toast
          this.toastr.success('تم مسح هذه الماده بنجاح!', 'تم المسح', { timeOut: 2000 });

          // Hide the modal after successful deletion
          const modalElement = document.getElementById('deleteSubjectModal');
          if (modalElement) {
            const modalInstance = Modal.getInstance(modalElement);
            modalInstance?.hide();
          }

          // Reset the selected subject variables
          this.selectedSubjectId = null;
          this.selectedSubjectIndex = null;
        },
        (error) => {
          // Handle error and show error toast
          this.toastr.error('خطأ في مسح المادة', 'خطأ', { timeOut: 2000 });
          console.error('Error deleting subject:', error);

          // Reset the selected subject variables in case of error
          this.selectedSubjectId = null;
          this.selectedSubjectIndex = null;
        }
      );
    }
  }



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
