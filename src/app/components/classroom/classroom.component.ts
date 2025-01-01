import { Component, ElementRef, HostListener, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GradeService } from 'src/app/services/grade/grade.service';
import { LevelService } from 'src/app/services/level/level.service';
import { ToastrService } from 'ngx-toastr';
import { Modal } from 'bootstrap';
import { ActivatedRoute, Router } from '@angular/router';



@Component({
  selector: 'app-classroom',
  templateUrl: './classroom.component.html',
  styleUrls: ['./classroom.component.css'],
})
export class ClassroomComponent {
  elements: any[] = [];
  levels: any[] = []; // Store the levels
  gradeForm: FormGroup;
  isDeleteModalOpen: boolean = false; // Modal open/close state
  selectedItemId: number | null = null; // Store the ID of the item to delete
  isMenuOpen: { [key: number]: boolean } = {};
    private globalClickListener!: () => void; // To manage global click listener
  isEditMode = false;
  currentGradeId: string = '';

   
  pageNumber = 1; // Current page
  itemsPerPage = 8; // Items per page
  totalItems = 9; // Initial total items
  maxVisiblePages = 5; // Maximum number of visible pages
  pages: number[] = []; // Array to hold the visible pages
  hasMoreData = true; // Flag to check if more data exists

  

  
  @ViewChild('createModal', { static: true }) createModal!: ElementRef;
  private modalInstance!: Modal;




  constructor(
    private elRef: ElementRef,
    private renderer: Renderer2,
    private fb: FormBuilder,
    private gradeService: GradeService,
    private levelService: LevelService,
    private toastr: ToastrService,
    private activatedRoute: ActivatedRoute,
    private router: Router,

  ) {
    this.gradeForm = this.fb.group({
      gradeName: ['', Validators.required],
      levelId: ['', Validators.required],
    });
  }

  ngOnInit() {
   
    this.getAllgrades();
    this.getAllLevels();

  }

  changePage(page: number): void {
    // Ensure we are not navigating beyond the available pages
    if (page >= 1 && page <= this.totalPages && page !== this.pageNumber) {
      this.pageNumber = page;
      this.getAllgrades();

      // If on the last page, try to load more data
      if (page === this.totalPages && this.hasMoreData) {
        this.fetchMoreData();
        this.getAllgrades();
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


  selectedGrade: any = null;


  onSelectFocus() {
    if (this.selectedGrade === null) {
      this.selectedGrade = null;
    }
  }

  onSelectBlur() {
    if (!this.selectedGrade) {
      this.selectedGrade = null;
    }
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
    this.gradeForm.reset();
  
    // Set the flag to false since this is "Add" mode, not "Edit"
    this.isEditMode = false;
  
    // Clear any selected grade ID, if any
    this.currentGradeId = ''; 
  
    // Open the modal using Bootstrap modal API
    const modalElement = document.getElementById('addModal');
    if (modalElement) {
      const modalInstance = Modal.getOrCreateInstance(modalElement); // Get or create instance
      modalInstance.show(); // Show the modal
    } else {
      console.error('Add modal element not found.');
    }
  }
  
  openEditModal(grade: any) {
    this.isEditMode = true;
    this.currentGradeId = grade.id; // Set the ID for the grade to be edited
  
    // Check if the levels are loaded correctly
    console.log('Levels:', this.levels);
  
    // Populate the form with the grade data
    this.gradeForm.patchValue({
      gradeName: grade.gradeName,
      levelId: grade.levelId,  // Make sure this levelId exists in the levels array
    });
  
    const modalElement = document.getElementById('editModal');
    if (modalElement) {
      const modalInstance = Modal.getOrCreateInstance(modalElement); // Reinitialize modal instance
      modalInstance.show(); // Show the modal
    } else {
      console.error('Edit modal element not found.');
    }
  }
  

  getAllgrades() {


  this.gradeService.getAllClasses(this.pageNumber, this.itemsPerPage).subscribe(
    (response) => {
      this.elements = response; // Ensure the response contains the required fields


},
    (error) => {
      console.error('Error fetching grades:', error);
    }
  );
  }

  getAllLevels() {
    this.levelService.getAllLevels().subscribe(
      (response) => {
        this.levels  = response; // Assign the fetched Regions
        console.log('levels:', this.elements);
      },
      (error) => {
        console.error('Error fetching level section:', error);
      }
    );
  }

  onLevelChange(event: Event) {
    const selectedValue = (event.target as HTMLSelectElement).value;
    console.log('Selected Level ID:', selectedValue);
  }
  

  
  onSubmitAdd(): void {
    if (this.gradeForm.invalid) {
      // Check for specific errors in the form
      this.toastr.error('يرجى تعبئة جميع الحقول المطلوبة!', 'خطأ', {
        timeOut: 2000, // Display for 2 seconds
      });
      return; // Stop further processing if the form is invalid
    }
  
    const formData = this.gradeForm.value;
    console.log('Form Data:', formData); // Ensure levelId is correct
  
    this.gradeService.addGrade(formData.levelId, formData).subscribe(
      () => {
        this.toastr.success('تم إضافة الصف بنجاح!', 'نجاح', {
          timeOut: 1000, // Display for 1 second
        });
        this.getAllgrades(); // Refresh list
        this.closeModalById('addModal');
      },
      (error) => this.handleError(error)
    );
  }
  
 isUpdating = false;

  onSubmitUpdate(): void {
    if (this.isUpdating) return;  // Prevent multiple submissions
  this.isUpdating = true;

  // Check if the form is valid
  if (this.gradeForm.invalid) {
    this.toastr.error('بالرجاء ملئ جميع الحقول المطلوبة', 'خطأ التحقق');
    this.isUpdating = false;  // Reset the flag
    return;
  }

  // Check if there is a valid ID for the grade to update
  if (!this.currentGradeId) {
    this.toastr.error('المعرف غير موجود!', 'خطأ');
    this.isUpdating = false;  // Reset the flag
    return;
  }

  // Prepare the data to be updated
  const updateData = {
    gradeName: this.gradeForm.value.gradeName,
    levelId: this.gradeForm.value.levelId,
  };

  // Call the service to update the grade
  this.gradeService.updateGrade(this.currentGradeId, updateData).subscribe(
    (response) => {
      // Success response
      this.toastr.success('تم تعديل الصف بنجاح!', 'تم التعديل', { timeOut: 2000 });
      this.gradeForm.reset();  // Reset the form
      this.getAllgrades();  // Refresh the list of grades
      this.isEditMode = false;  // Set the edit mode flag
      this.closeModalById('editModal');  // Close the modal
      this.isUpdating = false;  // Reset the flag
    },
    (error) => {
      // Error handling
      this.toastr.error('خطأ في تعديل الصف', 'خطأ');
      this.isUpdating = false;  // Reset the flag
    }
  );
  }


  private handleError(error: any) {
    console.error('An error occurred:', error);
  }


  deletegrade(id: number, index: number): void {
    // Call the service to delete the region
    this.gradeService.deleteGrade(id).subscribe(
      (response) => {
        console.log('grade deleted successfully:', response);
        this.elements.splice(index, 1); // Remove the deleted region from the list
        this.toastr.success('تم مسح هذا الصف بنجاح!', 'تم المسح', {
          timeOut: 1000, // Display for 2 seconds
        });
      },
      (error) => {
        console.error('Error deleting grade:', error);
        alert('Failed to delete grade');
      }
    );
  }


  selectedGradeId: number | null = null;
  selectedGradeIndex: number | null = null;

  openGradeConfirmModal(id: number, index: number): void {
    this.selectedGradeId = id;
    this.selectedGradeIndex = index;

    const modalElement = document.getElementById('gradeConfirmModal');
    if (modalElement) {
      const modalInstance = new Modal(modalElement);
      modalInstance.show();
    }
  }

  // Confirm deletion
  confirmDeletegrade(): void {
    if (this.selectedGradeId != null && this.selectedGradeIndex != null) {
      this.gradeService.deleteGrade(this.selectedGradeId).subscribe(
        () => {
          if (this.selectedGradeIndex !== null) {
            this.elements.splice(this.selectedGradeIndex, 1);
          }
          this.toastr.success('تم مسح هذا الصف بنجاح!', 'تم المسح', { timeOut: 2000 });
  
          const modalElement = document.getElementById('gradeConfirmModal');
          if (modalElement) {
            const modalInstance = Modal.getInstance(modalElement);
            modalInstance?.hide();
          }
  
          this.selectedGradeId = null;
          this.selectedGradeIndex = null;
        },
        (error) => {
          this.toastr.error('خطأ في مسح المرحلةهذا الصف', 'خطأ', { timeOut: 2000 });
          console.error('Error deleting level:', error);
  
          this.selectedGradeId = null;
          this.selectedGradeIndex = null;
        }
      );
    }
  }

  isModalVisible = false;

  // When you open the modal, set this to true
  openModal() {
    this.isModalVisible = true;
  }

  stopPropagation(event: Event): void {
    event.stopPropagation();
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
      this.elements.forEach(region => (region.isMenuOpen = false));
    }
  }
  // Toggle the dropdown menu visibility based on index
  showMenu(index: number): void {
    this.elements.forEach((region, i) => {
      region.isMenuOpen = i === index ? !region.isMenuOpen : false;
    });
  }

  // Handle clicks outside the component to close all menus
  handleOutsideClick(event: Event): void {
    if (!this.elRef.nativeElement.contains(event.target)) {
      this.isMenuOpen = {}; // Close all menus when clicking outside
    }
  }



  addContractActive: boolean = true; // Default the "إنشاء عقد جديد" button to active
  exportPdfActive: boolean = false; // Default the "تصدير PDF" button to inactive

  // Toggle the "إنشاء عقد جديد" button active/inactive state
  toggleAddContract() {
    this.addContractActive = true;
    this.exportPdfActive = false; // Make "تصدير PDF" inactive
this.openAddModal() 
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
}
