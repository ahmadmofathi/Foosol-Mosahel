import { Component, ElementRef, HostListener, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GradeService } from 'src/app/services/grade/grade.service';
import { LevelService } from 'src/app/services/level/level.service';
import { ToastrService } from 'ngx-toastr';
import { Modal } from 'bootstrap';



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

  
  @ViewChild('createModal', { static: true }) createModal!: ElementRef;
  private modalInstance!: Modal;




  constructor(
    private elRef: ElementRef,
    private renderer: Renderer2,
    private fb: FormBuilder,
    private gradeService: GradeService,
    private levelService: LevelService,
    private toastr: ToastrService
  ) {
    this.gradeForm = this.fb.group({
      gradeName: ['', Validators.required],
      levelId: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.getAllgrades();
    this.getAllLevels();

    this.globalClickListener = this.renderer.listen(
      'document',
      'click',
      (event: Event) => {
        this.handleOutsideClick(event);
      }
    );
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
    this.gradeService.getAllGrades().subscribe(
      (response) => {
        this.elements = response; // Make sure response contains 'id' field
        console.log('Fetched elements:', this.elements);
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
      if (this.gradeForm.valid) {
        const formData = this.gradeForm.value;
        console.log('Form Data:', formData); // Ensure levelId is correct
    
        this.gradeService.addGrade(formData.levelId, formData).subscribe(
          () => {
            this.toastr.success('تم إضافة الصف بنجاح!', 'نجاح' , {
              timeOut: 1000, // Display for 2 seconds
            });
            this.getAllgrades(); // Refresh list
            this.closeModalById('addModal');
          },
          (error) => this.handleError(error)
        );
      } else {
        console.warn('Form is invalid:', this.gradeForm.errors);
      }
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
        this.toastr.error('تم مسح هذا الصف بنجاح!', 'تم المسح', {
          timeOut: 1000, // Display for 2 seconds
        });
      },
      (error) => {
        console.error('Error deleting grade:', error);
        alert('Failed to delete grade');
      }
    );
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
