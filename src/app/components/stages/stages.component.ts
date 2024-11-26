import { Component, ElementRef, HostListener, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LevelService } from 'src/app/services/level/level.service';
import { Modal } from 'bootstrap';
import { ToastrService } from 'ngx-toastr';



@Component({
  selector: 'app-stages',
  templateUrl: './stages.component.html',
  styleUrls: ['./stages.component.css'],
})
export class StagesComponent {
  elements: any[] = [];
  levelForm: FormGroup;
  isDeleteModalOpen: boolean = false; // Modal open/close state
  selectedItemId: number | null = null; // Store the ID of the item to delete
  isMenuOpen: { [key: number]: boolean } = {};
  private globalClickListener!: () => void; // To manage global click listener
  isEditMode = false;
  currentLevelId: string | null = null;

  constructor(
    private elRef: ElementRef,
    private renderer: Renderer2,
    private fb: FormBuilder,
    private levelService: LevelService,
    private toastr: ToastrService
  ) {
    this.levelForm = this.fb.group({
      levelName: ['', Validators.required],
    });
  }

  @ViewChild('createModal', { static: true }) createModal!: ElementRef;
  private modalInstance!: Modal;

  ngOnInit() {
    this.getAllLevels();

    this.globalClickListener = this.renderer.listen('document', 'click', (event: Event) => {
      this.handleOutsideClick(event);
    });
  }

  getAllLevels() {
    this.levelService.getAllLevels().subscribe(
      (response) => {
        this.elements = response; // Assign the fetched Regions
        console.log('levels:', this.elements);
      },
      (error) => {
        console.error('Error fetching level section:', error);
      }
    );
  }

  onSubmitAdd(): void {
    if (this.levelForm.valid) {
      const newRegion = this.levelForm.value;
      this.levelService.addLevel(newRegion).subscribe(
        (response) => {
          this.elements.push(response); // Add the new region to the list
          this.toastr.success('تم إضافة المرحله بنجاح!', 'نجاح', { timeOut: 1000 });
          this.getAllLevels();

          const modalElement = document.getElementById('createModal');
          if (modalElement) {
            const modalInstance = Modal.getInstance(modalElement);
            modalInstance?.hide();  // Close the modal programmatically
          }
  
          // Close the add modal programmatically
          this.closeModalById('addModal');
        },
        (error) => {
          this.toastr.error('خطأ أثناء إضافة المرحله', 'خطأ', { timeOut: 1000 });
          console.error('Add region error:', error);
        }
      );
    }
  }


  onSubmitUpdate() {
    if (this.levelForm.valid && this.currentLevelId) {
      const updatedLevel = { id: this.currentLevelId, ...this.levelForm.value };
      this.levelService.updateLevel(this.currentLevelId, updatedLevel).subscribe(
        (response) => {
          const index = this.elements.findIndex((item) => item.id === this.currentLevelId);
          if (index !== -1) {
            this.elements[index] = response; // Update the region in the list
          }
          this.toastr.success('تم تحديث المرحله بنجاح!', 'نجاح', { timeOut: 1000 });
          this.getAllLevels();
  
          // Close the edit modal programmatically
          this.closeModalById('editModal');
        },
        (error) => {
          this.toastr.error('خطأ أثناء تحديث المرحله', 'خطأ', { timeOut: 1000 });
          console.error('Update region error:', error);
        }
      );
    } else {
      this.toastr.error('خطأ: لم يتم تحديد المرحله للتحديث', 'خطأ', { timeOut: 1000 });
    }
  }


  // onSubmitUpdate() {
  //   if (this.levelForm.valid && this.currentLevelId) {
  //     this.levelService.updateLevel(this.currentLevelId, this.levelForm.value).subscribe(
  //       () => {
  //         alert('Region updated successfully!');
  //         this.levelForm.reset();
  //         this.getAllLevels(); // Implement this method to refresh the regions list
  //         this.closeModal(); // Implement this method to close the modal
  //       },
  //       (error) => {
  //         console.error('Error updating region:', error);
  //         alert('Failed to update region.');
  //       }
  //     );
  //   } else {
  //     alert('Form is invalid or no region selected.');
  //   }
  // }

  // openEditModal(level: any) {
  //   this.isEditMode = true; // Set the mode to edit
  //   this.currentLevelId = level.id; // Store the current region's ID
  
 
  //   this.levelForm.patchValue({
  //     levelName: level.levelName, // Adjust based on your region object structure

  //   });
  
  //   // Open the modal (using the modal ID, if using Bootstrap modal, ensure it is triggered correctly)
  //   const modal = document.getElementById('editModal');
  //   if (modal) {
  //     (modal as any).classList.add('show');
  //     (modal as any).style.display = 'block';
  //   }
  // }
  
  


  deleteLevel(id: number, index: number): void {
    // Call the service to delete the region
    this.levelService.deleteLEvel(id).subscribe(
      (response) => {
        console.log('level deleted successfully:', response);
        this.elements.splice(index, 1); // Remove the deleted region from the list
        this.toastr.success('تم مسح هذه المرحله بنجاح!', 'تم المسح', { timeOut: 2000 });
      },
      (error) => {
        this.toastr.error('خطأ في مسح المرحلة', 'خطأ', { timeOut: 2000 });
        console.error('Error deleting level:', error);
       
      }
    );
  }

  
  
  openEditModal(region: any) {
    this.isEditMode = true;
    this.currentLevelId = region.id; // Set the current region ID for updating
    this.levelForm.patchValue({
      levelName: region.levelName, // Adjust based on your region object structure

    });
  
    const modal = document.getElementById('editModal');
    if (modal) {
      const modalInstance = new Modal(modal);
      modalInstance.show(); // Show the modal
    }
  }
  

  openAddModal() {
    this.isEditMode = false;
    this.currentLevelId = null; // Clear the current region ID
    this.levelForm.reset(); // Reset the form
  
    const modal = document.getElementById('addModal');
    if (modal) {
      const modalInstance = new Modal(modal);
      modalInstance.show(); // Show the modal
    }
  }
  closeModal(): void {
    if (this.modalInstance) {
      this.modalInstance.hide();
    }
    document.querySelectorAll('.modal-backdrop').forEach(backdrop => backdrop.remove());
    document.body.classList.remove('modal-open');
    document.body.style.removeProperty('overflow');
    document.body.style.removeProperty('padding-right');
    this.modalInstance = undefined!;
  }


  closeModalById(modalId: string): void {
    const modalElement = document.getElementById(modalId);
    if (modalElement) {
      const modalInstance = Modal.getInstance(modalElement);
      modalInstance?.hide(); // Close the modal
    }
    // Clean up Bootstrap modal styles
    document.querySelectorAll('.modal-backdrop').forEach(backdrop => backdrop.remove());
    document.body.classList.remove('modal-open');
    document.body.style.removeProperty('overflow');
    document.body.style.removeProperty('padding-right');
  }

  stopPropagation(event: Event): void {
    event.stopPropagation();
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
    this.openAddModal();
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

  showMenu(index: number): void {
    this.elements.forEach((region, i) => {
      region.isMenuOpen = i === index ? !region.isMenuOpen : false;
    });
  }
}
